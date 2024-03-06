// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {ISuperfluid, ISuperToken} from "@superfluid-finance/contracts/interfaces/superfluid/ISuperfluid.sol";
import {SuperTokenV1Library} from "@superfluid-finance/contracts/apps/SuperTokenV1Library.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";

contract eSovCollection is ERC721Enumerable, IERC2981, Ownable {
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
    uint256 public immutable maxStreamsPerWallet;
    uint256 public maxTotalSupply;
    ImageSourceType public immutable imageSource;
    bool public immutable isSBT;
    uint8 public immutable specialCode;
    int96 public immutable flowRate;
    uint96 public royaltyPercentage;
    address public royalityReceiver;

    ISuperToken public immutable dux;

    string[] public _collectionAttributes;
    address[] private addressList;
    uint256 private _currentTokenId = 0;
    uint256 public _currentSeason = 1;

    // Mappings
    mapping(uint256 => bool) private _tokenHasStream;
    mapping(uint256 => string) private tokenURIs;

    // Struct to store configuration for the eSov NFTCollection

    struct CollectionConfig {
        string _name;
        string _symbol;
        uint256 mintPrice;
        uint256 specialMintPrice;
        uint256 batchMintAmount;
        uint256 maxPerWallet;
        uint256 maxStreamsPerWallet;
        uint256 maxTotalSupply;
        ImageSourceType imageSource;
        bool isSBT;
        uint8 specialCode;
        int96 flowRate;
        string[] collectionAttributes;
        uint96 royaltyPercentage;
        address royalityReceiver;
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
        require(
            config.royaltyPercentage <= 100,
            "Royalty percentage cannot be more than 100"
        );
        mintPrice = config.mintPrice;
        specialMintPrice = config.specialMintPrice;
        batchMintAmount = config.batchMintAmount;
        maxPerWallet = config.maxPerWallet;
        maxStreamsPerWallet = config.maxStreamsPerWallet;
        maxTotalSupply = config.maxTotalSupply;
        imageSource = config.imageSource;
        isSBT = config.isSBT;
        specialCode = config.specialCode;
        flowRate = config.flowRate;
        royaltyPercentage = config.royaltyPercentage;
        _collectionAttributes = config.collectionAttributes;
        royalityReceiver = config.royalityReceiver;
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
    function mint(string memory _tokenURI) public payable {
        if (maxTotalSupply != 0) {
            if (imageSource != ImageSourceType.Dynamic) {
                require(
                    _currentTokenId + 1 <= maxTotalSupply,
                    "Exceeds max total supply"
                );
            }
            if (imageSource == ImageSourceType.Dynamic) {
                if (_currentTokenId + 1 > maxTotalSupply * _currentSeason) {
                    _currentSeason++;
                    _currentTokenId = maxTotalSupply * (_currentSeason - 1);
                }
            }
        }

        if (maxPerWallet != 0) {
            require(
                balanceOf(msg.sender) < maxPerWallet,
                "Exceeds max per wallet"
            );
        }

        require(msg.value == mintPrice, "Insufficient funds");
        int96 existingFlowRate = getCurrentFlowRate(msg.sender);
        int96 maxStreamsPerWalletFlowRate = int96(int256(maxStreamsPerWallet)) *
            flowRate;
        if (existingFlowRate < maxStreamsPerWalletFlowRate) {
            _createStream(msg.sender);
            _tokenHasStream[_currentTokenId] = true;
        }
        _setTokenURI(_currentTokenId, _tokenURI);
        _safeMint(msg.sender, _currentTokenId++);
    }

    /**
     * @dev Allows the owner to mint a new token at a special price.
     * @notice Requires payment of `specialMintPrice` and adherence to the max total supply.
     */
    function adminMint(string memory _tokenURI) public payable onlyOwner {
        if (maxTotalSupply != 0) {
            require(
                _currentTokenId + 1 <= maxTotalSupply,
                "Exceeds max total supply"
            );
        }
        require(msg.value == specialMintPrice, "Insufficient funds");
        _tokenHasStream[_currentTokenId] = true;
        _setTokenURI(_currentTokenId, _tokenURI);
        _safeMint(owner(), _currentTokenId++);
        _createStream(owner());
    }

    /**
     * @dev Allows the owner to mint multiple tokens at once.
     * @notice Requires payment of `specialMintPrice` per token and adherence to the max total supply.
     */
    function batchMint(string[] memory _tokenURIs) public payable onlyOwner {
        require(batchMintAmount > 0, "Number of tokens cannot be zero");
        require(
            _tokenURIs.length == batchMintAmount,
            "Number of token URIs does not match batchMintAmount"
        );
        if (maxTotalSupply != 0) {
            require(
                _currentTokenId + batchMintAmount <= maxTotalSupply,
                "Exceeds max total supply"
            );
        }

        require(
            msg.value == specialMintPrice * batchMintAmount,
            "Insufficient funds"
        );

        for (uint256 i = 0; i < batchMintAmount; i++) {
            _tokenHasStream[_currentTokenId] = true;
            _setTokenURI(_currentTokenId, _tokenURIs[i]);
            _safeMint(owner(), _currentTokenId++);
        }
        _createBatchStream(owner());
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

    /**
     * @dev Restarts an Superfluid stream to a given address.
     * @param streamAddress The address of the stream recipient.
     * @notice Only callable by the owner.
     */
    function reStartStream(address streamAddress) external onlyOwner {
        _reStartStream(streamAddress);
    }

    /**
     * @dev Restarts Superfluid streams initiated by this contract.
     * @notice Only callable by the owner.
     */

    function reStartAllStreams() external onlyOwner {
        for (uint256 i = 0; i < addressList.length; i++) {
            address streamAddress = addressList[i];
            _reStartStream(streamAddress);
        }
    }

    // EIP-2981 royalty info for marketplaces
    function royaltyInfo(
        uint256 /* tokenId */,
        uint256 salePrice
    ) external view override returns (address receiver, uint256 royaltyAmount) {
        receiver = royalityReceiver;
        royaltyAmount = (salePrice * royaltyPercentage) / 100; // Using the dynamic value for all tokens
        return (receiver, royaltyAmount);
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

    /**
     * @dev Retrieves the current season.
     * @return The current season in the contract.
     * @notice Only applicable for Dynamic image source.
     * @notice The season starts from 1.
     */

    function getCurrentSeason() public view returns (uint256) {
        return _currentSeason;
    }

    /**
     * @dev Retrieves whether a token has a Superfluid stream.
     * @param tokenId The ID of the token.
     * @return A boolean indicating whether the token has a stream.
     */
    function tokenHasStream(uint256 tokenId) public view returns (bool) {
        return _tokenHasStream[tokenId];
    }

    /**
     * @dev Retrieves the token URI for a given token ID.
     * @param tokenId The ID of the token.
     * @return The URI of the token.
     */
    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        return tokenURIs[tokenId];
    }

    /**
     * @dev Retrieves the token Ids for a given owner.
     * @param owner The address of the owner.
     * @return An array of strings representing the URIs of the tokens owned by the given address.
     */
    function tokensOfOwner(address owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory result = new uint256[](tokenCount);
        for (uint256 i = 0; i < tokenCount; i++) {
            result[i] = tokenOfOwnerByIndex(owner, i);
        }
        return result;
    }

    // Internal functions

    /**
     * @dev Internal function to set the token URI.
     * @param tokenId The ID of the token.
     * @param _tokenURI The URI of the token.
     */

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal {
        tokenURIs[tokenId] = _tokenURI;
    }

    /**
     * @dev Internal function to create a Superfluid stream.
     * @param to The address to which the stream is created.
     */

    function _createStream(address to) internal {
        if (flowRate == 0) {
            return;
        }
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
        if (flowRate == 0) {
            return;
        }
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

    /*
    Internal function to retrive the restart index for a given address
     */

    function _getRestartIndex(
        address streamAddress
    ) public view returns (uint256) {
        if (streamAddress == owner()) {
            return balanceOf(streamAddress);
        } else {
            uint256 balance = balanceOf(streamAddress);
            uint256 _restartIndex = 0;
            for (uint256 i = 0; i < balance; i++) {
                uint256 tokenId = tokenOfOwnerByIndex(streamAddress, i);
                if (_tokenHasStream[tokenId]) {
                    _restartIndex++;
                }
            }
            return _restartIndex;
        }
    }

    /**
     * @dev Internal function to restart a Superfluid stream.
     * @param streamAddress The address of the stream recipient.
     */

    function _reStartStream(address streamAddress) internal {
        if (flowRate == 0) {
            return;
        }
        uint256 restartIndex = _getRestartIndex(streamAddress);

        // Multiply flowRate by restartIndex
        int96 flowAmount = int96(flowRate * int256(restartIndex));

        // Create flow only if restartIndex is non-zero
        if (flowAmount > 0) {
            // Assuming dux.createFlow returns a boolean indicating success
            bool flowCreated = dux.createFlow(streamAddress, flowAmount);
            require(flowCreated, "Flow creation failed");
        }
    }

    // override functions

    // Overriding all transfer functions for managing streams accordingly

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override(ERC721, IERC721) {
        require(!isSBT, "Soulbound Tokens cannot be transferred");
        _beforeTokenTransfer(from, to, tokenId);
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
        _beforeTokenTransfer(from, to, tokenId);
        super.safeTransferFrom(from, to, tokenId, _data);
    }

    /**
     * @dev Hook that is called before any token transfer that mangages Superfluid streams.
     * @param from The address from which the token is transferred.
     * @param to The address to which the token is transferred.
     * @notice Overrides the ERC721 `_beforeTokenTransfer` method.
     */

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal {
        require(
            _exists(tokenId),
            "ERC721: operator query for nonexistent token"
        );
        if (maxPerWallet != 0) {
            require(balanceOf(to) < maxPerWallet, "Exceeds max per wallet");
        }
        if (flowRate == 0) {
            return;
        }
        if (_tokenHasStream[tokenId]) {
            // If the token has a stream
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
                    if (
                        toFlowRate <
                        int96(int256(maxStreamsPerWallet)) * flowRate
                    ) {
                        dux.updateFlow(to, toFlowRate + flowRate);
                    }
                } else {
                    _createStream(to);
                }
            }
        }
    }
}
