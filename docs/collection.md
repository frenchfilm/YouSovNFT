## Overview

The `eSovCollection` and `eSovCollectionFactory` contracts are part of a system designed to create and manage NFT collections on the Ethereum blockchain, leveraging the Superfluid protocol for streaming payments.

## `eSovCollection` Smart Contract

The `eSovCollection` contract is an ERC721 token that integrates with Superfluid to enable streaming payments for token holders. It supports minting with special conditions, batch minting, and dynamic NFT attributes. The contract also implements EIP-2981 for royalty information.

### State Variables:

- `mintPrice`: The price to mint a new token.
- `specialMintPrice`: A special price for minting, available under certain conditions.
- `batchMintAmount`: The number of tokens that can be minted at once in a batch.
- `maxPerWallet`: The maximum number of tokens that a single wallet can hold.
- `maxStreamsPerWallet`: The maximum number of streams a single wallet can have.
- `maxTotalSupply`: The maximum total supply of tokens.
- `imageSource`: The source type of the token images.
- `isSBT`: A boolean indicating if the token is a Soulbound Token (non-transferable).
- `specialCode`: A special code that might be used for minting under special conditions.
- `flowRate`: The rate at which the Superfluid stream flows.
- `royaltyPercentage`: The percentage of sales that will be paid as royalties.
- `royalityReceiver`: The address that will receive the royalty payments.
- `dux`: The Superfluid token used for streaming payments.

### Functions:

#### Public and External Functions:

- `mint(string memory _tokenURI)`: Allows users to mint a new token with a Superfluid stream.
- `adminMint(string memory _tokenURI)`: Allows the contract owner to mint a new token at a special price.
- `batchMint(string[] memory _tokenURIs)`: Allows the contract owner to mint multiple tokens at once.
- `gainDux(uint256 amount)`: Allows the owner to deposit DUX tokens into the contract for streaming.
- `withdrawDux(uint256 amount)`: Allows the owner to withdraw DUX tokens from the contract.
- `withdrawEther()`: Allows the owner to withdraw Ether from the contract.
- `cancelStream(address streamAddress)`: Cancels an active Superfluid stream to a given address.
- `cancelAllStreams()`: Cancels all active Superfluid streams initiated by the contract.
- `reStartStream(address streamAddress)`: Restarts a Superfluid stream to a given address.
- `reStartAllStreams()`: Restarts all Superfluid streams initiated by the contract.
- `royaltyInfo(uint256 tokenId, uint256 salePrice)`: Implements EIP-2981 to provide royalty information for marketplaces.
- `getCurrentFlowRate(address streamAddress)`: Retrieves the current flow rate of a Superfluid stream to a given address.
- `getduxBalance()`: Retrieves the DUX balance of the contract.
- `getCollectionAttributes()`: Retrieves the collection attributes.
- `getCurrentTokenId()`: Retrieves the current token ID.
- `getCurrentSeason()`: Retrieves the current season (for dynamic image source).
- `tokenHasStream(uint256 tokenId)`: Checks if a token has a Superfluid stream.
- `tokenURI(uint256 tokenId)`: Retrieves the token URI for a given token ID.

#### Internal Functions:

- `_setTokenURI(uint256 tokenId, string memory _tokenURI)`: Sets the token URI.
- `_createStream(address to)`: Creates a Superfluid stream to a given address.
- `_createBatchStream(address to)`: Creates a Superfluid stream for batch minting.
- `_cancelStream(address streamAddress)`: Cancels a Superfluid stream.
- `_reStartStream(address streamAddress)`: Restarts a Superfluid stream.
- `_beforeTokenTransfer(address from, address to, uint256 tokenId)`: Hook that is called before any token transfer, managing Superfluid streams accordingly.

### Override Functions:

- `transferFrom(address from, address to, uint256 tokenId)`: Overridden to manage Superfluid streams and enforce Soulbound Token logic.
- `safeTransferFrom(address from, address to, uint256 tokenId)`: Overridden to manage Superfluid streams and enforce Soulbound Token logic.
- `safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data)`: Overridden to manage Superfluid streams and enforce Soulbound Token logic.


## eSovCollectionFactory

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