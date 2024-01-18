// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/access/Ownable.sol";
import {ISuperToken} from "@superfluid-finance/contracts/interfaces/superfluid/ISuperfluid.sol";
import {eSovCollection} from "./eSovCollection.sol";

/**
 * @title eSovCollectionFactory
 * @dev This contract allows for the creation of eSov NFT collection contracts.
 * It is designed to work with Superfluid's ISuperToken and OpenZeppelin's Ownable contract.
 */

contract eSovCollectionFactory is Ownable {
    ISuperToken public immutable dux;

    // Array to store addresses of all created eSovCollection contracts
    address[] public eSovInstances;

    // Event to emit when a new eSovCollection is created
    event eSovNFTCollectionCreated(address indexed owner, address nftCollection);

    /**
     * @dev Constructor for eSovCollectionFactory.
     * @param _dux Address of the Superfluid ISuperToken (dux).
     */
    constructor(ISuperToken _dux) Ownable() {
        require(address(_dux) != address(0), "SuperToken address cannot be zero");
        dux = _dux;
    }

    /**
     * @dev Creates a new eSOV NFTCollection contract.
     * @param config Configuration for the eSOV NFTCollection.
     * @return The address of the newly created NFTCollection contract.
     */

    function createNFTCollection(
        eSovCollection.CollectionConfig memory config
    ) public onlyOwner returns (address) {
        eSovCollection neweSovCollection = new eSovCollection(config, owner(), dux);

        emit eSovNFTCollectionCreated(owner(), address(neweSovCollection));
        eSovInstances.push(address(neweSovCollection));

        return address(neweSovCollection);
    }

    /**
     * @dev Retrieves all eSov NFT collection instances created by this factory.
     * @return An array of addresses of the NFTCollection instances.
     */
    function geteSovInstances() public view returns (address[] memory) {
        return eSovInstances;
    }
}
