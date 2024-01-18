## Overview

The `eSovCollection` and `eSovCollectionFactory` contracts are part of a system designed to create and manage NFT collections on the Ethereum blockchain, leveraging the Superfluid protocol for streaming payments.

### eSovCollection

`eSovCollection` is an ERC721 token contract with additional features for minting NFTs, managing metadata, and integrating with Superfluid streams.

#### Key Features:

- ERC721 token standard implementation with Enumerable extension.
- Integration with Superfluid for streaming payments (using ISuperToken).
- Customizable NFT metadata and minting mechanics.
- Support for Soulbound Tokens (non-transferable tokens).

#### State Variables:

- `mintPrice`, `specialMintPrice`, `batchMintAmount`, `maxPerWallet`, `maxTotalSupply`: Pricing and supply configurations.
- `imageSource`: Determines the source of NFT images (preset, random from a set, or dynamic).
- `isSBT`: Indicates if the token is a Soulbound Token.
- `specialCode`: A unique code for special minting purposes.
- `flowRate`: The rate at which Superfluid streams are created.
- `dux`: The Superfluid ISuperToken instance.
- `_collectionAttributes`: Custom attributes for the collection.
- `addressList`: A list of addresses involved in Superfluid streams.
- `_currentTokenId`: Tracks the current token ID for minting.

#### Functions:

- Constructor: Initializes the contract with given configuration.
- `mint()`: Allows users to mint a new token with Superfluid stream.
- `adminMint()`, `batchMint()`: Special minting functions for the owner.
- `gainDux()`, `withdrawDux()`, `withdrawEther()`: Manage contract funds.
- `cancelStream()`, `cancelAllStreams()`: Manage Superfluid streams.
- `getCurrentFlowRate()`, `getduxBalance()`, `getCollectionAttributes()`, `getCurrentTokenId()`: Query contract state.
- `_createStream()`, `_createBatchStream()`, `_cancelStream()`: Internal functions for stream management.
- Overridden ERC721 functions for transfer and token URI management.

### eSovCollectionFactory

`eSovCollectionFactory` is a contract for creating `eSovCollection` instances.

#### Key Features:

- Factory pattern for creating `eSovCollection` contracts.
- Tracks created instances for easy retrieval.

#### State Variables:

- `dux`: The Superfluid ISuperToken instance.
- `eSovInstances`: Array of created `eSovCollection` contract addresses.

#### Functions:

- Constructor: Initializes the factory with a Superfluid token.
- `createNFTCollection()`: Creates a new `eSovCollection` instance.
- `geteSovInstances()`: Retrieves addresses of all created collections.

#### Events:

- `eSovNFTCollectionCreated`: Emitted when a new collection is created.

## Usage

To use these contracts, deploy `eSovCollectionFactory` with a Superfluid token address(Dallor DUX). Then, use the factory to create `eSovCollection` instances with specific configurations. Each `eSovCollection` can mint NFTs, manage Superfluid streams, and handle custom metadata.

### Deployment

```
forge create --rpc-url <RPCURL> --private-key '<YourPrivateKey>' src/eSovCollectionFactory.sol:eSovCollectionFactory --constructor-args '<DallorAddress>'
```

- Replace `<RPCURL>`, `<YourPrivateKey>`, and `<DallorAddress>` with your RPC URL, your private key, and the Dallor address, respectively.


### Post Deployment

- After Deployment replace the constants in frontend/src/constants/constants.js accordingly