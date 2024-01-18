// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {ISuperfluid, ISuperToken} from "@superfluid-finance/contracts/interfaces/superfluid/ISuperfluid.sol";
import {SuperTokenV1Library} from "@superfluid-finance/contracts/apps/SuperTokenV1Library.sol";

contract eSovCollection is ERC721Enumerable, Ownable {
    using SuperTokenV1Library for ISuperToken;

    enum ImageSourceType {
        RandomFromSet,
        SinglePreset,
        Dynamic
    }

    // State variables
    uint256 public immutable mintPrice;
    uint256 public immutable specialMintPrice;
    uint256 public immutable batchMintAmount;
    uint256 public immutable maxPerWallet;
    uint256 public immutable maxTotalSupply;
    ImageSourceType public immutable imageSource;
    bool public immutable isSBT;
    uint8 public immutable specialCode;
    int96 public immutable flowRate;

    ISuperToken public immutable dux;

    string[] public _collectionAttributes;
    address[] private addressList;
    uint256 private _currentTokenId = 0;

    // Metadata URIs

    string private constant presetMetadataURI =
        "https://demotokenuri.fly.dev/metadata/single_image";
    string private constant baseDynamicMetadataURI =
        "https://demotokenuri.fly.dev/metadata/pfps/";
    string[5] private metadataURIs = [
        "https://demotokenuri.fly.dev/metadata/presets/image1",
        "https://demotokenuri.fly.dev/metadata/presets/image2",
        "https://demotokenuri.fly.dev/metadata/presets/image3",
        "https://demotokenuri.fly.dev/metadata/presets/image4",
        "https://demotokenuri.fly.dev/metadata/presets/image5"
    ];

    // Struct to store configuration for the eSov NFTCollection

    struct CollectionConfig {
        string _name;
        string _symbol;
        uint256 mintPrice;
        uint256 specialMintPrice;
        uint256 batchMintAmount;
        uint256 maxPerWallet;
        uint256 maxTotalSupply;
        ImageSourceType imageSource;
        bool isSBT;
        uint8 specialCode;
        int96 flowRate;
        string[] collectionAttributes;
    }

    /**
     * @dev Constructor for eSovCollection.
     * @param config Configuration for the eSovCollection.
     * @param _owner Address of the owner of the eSovCollection.
     * @param _dux Address of the Superfluid ISuperToken (dux).
     */

    constructor(
        CollectionConfig memory config,
        address _owner,
        ISuperToken _dux
    ) ERC721(config._name, config._symbol) Ownable() {
        mintPrice = config.mintPrice;
        specialMintPrice = config.specialMintPrice;
        batchMintAmount = config.batchMintAmount;
        maxPerWallet = config.maxPerWallet;
        maxTotalSupply = config.maxTotalSupply;
        imageSource = config.imageSource;
        isSBT = config.isSBT;
        specialCode = config.specialCode;
        flowRate = config.flowRate;
        _collectionAttributes = config.collectionAttributes;
        transferOwnership(_owner); // Transfer ownership to the owner of the factory contract
        require(
            address(_dux) != address(0),
            "ISuperToken address cannot be zero"
        );
        dux = _dux; // Set the SuperToken address
    }

    // External functions

    /**
     * @dev Allows users to mint a new token and get a Superfluid stream.
     * @notice Requires payment of `mintPrice` and adherence to the max total supply.
     */
    function mint() public payable {
        require(
            _currentTokenId + 1 <= maxTotalSupply,
            "Exceeds max total supply"
        );
        require(msg.value == mintPrice, "Insufficient funds");
        _safeMint(msg.sender, _currentTokenId++);
        int96 existingFlowRate = getCurrentFlowRate(msg.sender);
        int96 maxPerWalletFlowRate = int96(int256(maxPerWallet)) * flowRate;
        if (existingFlowRate < maxPerWalletFlowRate) {
            _createStream(msg.sender);
        }
    }

    /**
     * @dev Allows the owner to mint a new token at a special price.
     * @notice Requires payment of `specialMintPrice` and adherence to the max total supply.
     */
    function adminMint() public payable onlyOwner {
        require(
            _currentTokenId + 1 <= maxTotalSupply,
            "Exceeds max total supply"
        );
        require(msg.value == specialMintPrice, "Insufficient funds");

        _safeMint(owner(), _currentTokenId++);
        _createStream(owner());
    }

    /**
     * @dev Allows the owner to mint multiple tokens at once.
     * @notice Requires payment of `specialMintPrice` per token and adherence to the max total supply.
     */
    function batchMint() public payable onlyOwner {
        require(batchMintAmount > 0, "Number of tokens cannot be zero");
        require(
            _currentTokenId + batchMintAmount <= maxTotalSupply,
            "Exceeds max total supply"
        );
        require(
            msg.value == specialMintPrice * batchMintAmount,
            "Insufficient funds"
        );

        for (uint256 i = 0; i < batchMintAmount; i++) {
            _safeMint(owner(), _currentTokenId++);
        }
        _createBatchStream(owner());
    }

    /**
     * @dev Allows the owner to deposit dux into the contract for streaming.
     * @param amount The amount of dux to deposit.
     */
    function gainDux(uint256 amount) external onlyOwner {
        // Transfer dux from the owner to the contract
        require(
            dux.transferFrom(msg.sender, address(this), amount),
            "dux transfer failed"
        );
    }

    /**
     * @dev Allows the owner to withdraw dux from the contract.
     * @param amount The amount of dux to withdraw.
     */
    function withdrawDux(uint256 amount) external onlyOwner {
        require(amount <= dux.balanceOf(address(this)), "Insufficient balance");
        require(dux.transfer(msg.sender, amount), "Transfer failed");
    }

    /**
     * @dev Allows the owner to withdraw Ether from the contract.
     */
    function withdrawEther() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No Ether left to withdraw");

        (bool success, ) = owner().call{value: balance}("");
        require(success, "Transfer failed.");
    }

    /**
     * @dev Cancels an active Superfluid stream to a given address.
     * @param streamAddress The address of the stream recipient.
     * @notice Only callable by the owner.
     */
    function cancelStream(address streamAddress) external onlyOwner {
        _cancelStream(streamAddress);
    }

    /**
     * @dev Cancels all active Superfluid streams initiated by this contract.
     * @notice Only callable by the owner.
     */
    function cancelAllStreams() external onlyOwner {
        for (uint256 i = 0; i < addressList.length; i++) {
            address streamAddress = addressList[i];
            int96 userFlowRate = getCurrentFlowRate(streamAddress);
            if (userFlowRate != 0) {
                _cancelStream(streamAddress);
            }
        }
    }

    // Public functions

    /**
     * @dev Retrieves the current flow rate of a Superfluid stream to a given address.
     * @param streamAddress The address of the stream recipient.
     * @return The current flow rate to the given address.
     */
    function getCurrentFlowRate(
        address streamAddress
    ) public view returns (int96) {
        return dux.getFlowRate(address(this), streamAddress);
    }

    /**
     * @dev Retrieves the dux balance of the contract.
     * @return The dux balance held by the contract.
     */
    function getduxBalance() public view returns (uint256) {
        return dux.balanceOf(address(this));
    }

    /**
     * @dev Retrieves the collection attributes.
     * @return An array of strings representing the collection attributes.
     */
    function getCollectionAttributes() public view returns (string[] memory) {
        return _collectionAttributes;
    }

    /**
     * @dev Retrieves the current token ID.
     * @return The current token ID in the contract.
     */
    function getCurrentTokenId() public view returns (uint256) {
        return _currentTokenId;
    }

    // Internal functions

    /**
     * @dev Internal function to create a Superfluid stream.
     * @param to The address to which the stream is created.
     */

    function _createStream(address to) internal {
        int96 existingFlowRate = getCurrentFlowRate(to);
        bool success;

        if (existingFlowRate == 0) {
            // If there's no existing flow, create a new one
            success = dux.createFlow(to, flowRate);
            require(success, "Flow creation failed");

            addressList.push(to);
        } else {
            // If there's an existing flow, update it by adding the new flowRate
            int96 newFlowRate = existingFlowRate + flowRate;
            success = dux.updateFlow(to, newFlowRate);
            require(success, "Flow update failed");
        }
    }

    /**
     * @dev Internal function to create a batch Superfluid stream.
     * @param to The address to which the stream is created.
     */
    function _createBatchStream(address to) internal {
        int96 existingFlowRate = getCurrentFlowRate(to);
        bool success;

        if (existingFlowRate == 0) {
            // If there's no existing flow, create a new one
            success = dux.createFlow(
                to,
                flowRate * int96(int256(batchMintAmount))
            );
            require(success, "Flow creation failed");
            addressList.push(to);
        } else {
            // If there's an existing flow, update it by adding the new flowRate
            int96 newFlowRate = existingFlowRate +
                flowRate *
                int96(int256(batchMintAmount));
            success = dux.updateFlow(to, newFlowRate);
            require(success, "Flow update failed");
        }
    }

    /**
     * @dev Internal function to cancel a Superfluid stream.
     * @param streamAddress The address of the stream recipient.
     */

    function _cancelStream(address streamAddress) internal {
        // Superfluid logic to cancel the stream
        dux.deleteFlow(address(this), streamAddress);
    }

    // override functions

    // Overriding all transfer functions for managing streams accordingly

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override(ERC721, IERC721) {
        require(!isSBT, "Soulbound Tokens cannot be transferred");
        _beforeTokenTransfer(from, to);
        super.transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override(ERC721, IERC721) {
        safeTransferFrom(from, to, tokenId, "");
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public override(ERC721, IERC721) {
        require(!isSBT, "Soulbound Tokens cannot be transferred");
        _beforeTokenTransfer(from, to);
        super.safeTransferFrom(from, to, tokenId, _data);
    }

    /**
     * @dev Hook that is called before any token transfer that mangages Superfluid streams.
     * @param from The address from which the token is transferred.
     * @param to The address to which the token is transferred.
     * @notice Overrides the ERC721 `_beforeTokenTransfer` method.
     */

    function _beforeTokenTransfer(address from, address to) internal {
        int96 fromFlowRate = getCurrentFlowRate(from);
        int96 toFlowRate = getCurrentFlowRate(to);

        // Adjust the flow rate for the sender
        if (fromFlowRate == flowRate) {
            dux.deleteFlow(address(this), from);
        } else if (fromFlowRate > flowRate) {
            dux.updateFlow(from, fromFlowRate - flowRate);
        }

        // Adjust the flow rate for the receiver
        if (fromFlowRate != 0) {
            if (toFlowRate > 0) {
                if (toFlowRate < int96(int256(maxPerWallet)) * flowRate) {
                    dux.updateFlow(to, toFlowRate + flowRate);
                }
            } else {
                _createStream(to);
            }
        }
    }

    /**
     * @dev Returns the URI for a given token ID.
     * @param tokenId The ID of the token.
     * @return A string representing the metadata URI.
     * @notice Overrides the ERC721 `tokenURI` method.
     */

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        // Handle different image source types
        if (imageSource == ImageSourceType.RandomFromSet) {
            // Select a random URI from the set
            uint256 randomIndex = uint256(
                keccak256(abi.encodePacked(tokenId))
            ) % metadataURIs.length;
            return metadataURIs[randomIndex];
        } else if (imageSource == ImageSourceType.SinglePreset) {
            // Return the preset URI
            return presetMetadataURI;
        } else if (imageSource == ImageSourceType.Dynamic) {
            // Construct a dynamic URI
            return
                string(
                    abi.encodePacked(
                        baseDynamicMetadataURI,
                        Strings.toHexString(uint160(address(this)), 20),
                        "/",
                        Strings.toString(tokenId)
                    )
                );
        } else {
            // Default case, if needed
            return "";
        }
    }
}
