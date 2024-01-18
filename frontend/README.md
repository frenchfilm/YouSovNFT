# Documentation for `ESOV ADMIN DASHBOARD`

## Overview

`AdminDashboard.js` is a React component that serves as the main interface for the administration of an NFT collection. It integrates various functionalities such as contract information display, minting functions, financial management, and stream management. The component uses the `wagmi` library for Ethereum blockchain interactions and Apollo Client for GraphQL queries.

## Components

### `AdminDashboard`

- **Description**: The primary component that renders the admin dashboard.
- **Props**: None.
- **Functionality**:
  - Displays the navigation bar.
  - Checks if the current user is the owner of the NFT collection.
  - Renders different sections like Contract Information, Minting Functions, Financial Management, and Stream Management.

### `ContractInfo`

- **Description**: Displays information about the NFT collection contract.
- **Props**:
  - `collectionId`: The ID of the NFT collection.
- **Functionality**:
  - Fetches and displays various contract details like mint price, special mint price, batch mint amount, etc.

### `MintingFunctions`

- **Description**: Provides functionalities for minting NFTs.
- **Props**: None.
- **Functionality**:
  - Allows admin to perform actions like admin mint and batch mint.
  - Displays minting status and errors if any.

### `FinancialManagement`

- **Description**: Manages financial aspects of the NFT collection.
- **Props**: None.
- **Functionality**:
  - Displays and manages the balance of the contract.
  - Provides functionalities to withdraw Ether and DUX tokens and Load the contract with DUX

### `Streams`

- **Description**: Manages superfluid streams.
- **Props**:
  - `address`: The address of the NFT collection.
- **Functionality**:
  - Displays active streams of the collection and allows the admin to cancel them.

### `Mint`

- **Description**: This is the main component that renders the public minting page.
- **Functionality**:
  - Fetches the list of NFT instances using the `useContractRead` hook from the `wagmi` library.
  - Maps each NFT collection to a `MintCard` component.
- **Props**: None.

### `MintCard`

- **Description**: Represents a card for a single NFT collection, allowing users to mint NFTs from that collection.
- **Props**:
  - `collectionId`: The unique identifier of the NFT collection.
- **Functionality**:
  - Fetches various details of the NFT collection such as mint price, image source type, user balance, DUX balance, flow rate, and current token ID.
  - Provides a button to mint NFTs, which triggers the `generateMetadataandMint` function.
  - Displays relevant information about the user's ability to mint based on their current DUX balance and flow rate.

#### Key Functionalities

1. **Fetching NFT Collection Data**: Uses `useContractRead` from `wagmi` to read data from the blockchain, fetching details like mint price, DUX balance, and flow rate.

2. **Minting NFTs**:

   - The `mintNFT` function is prepared using `usePrepareContractWrite` and executed with `useContractWrite`.
   - Before minting, metadata is generated if the image source type is generative (type 2).
   - The `generateMetadata` function creates a canvas element, draws on it, and then converts it to a Blob. This Blob, along with other attributes, is sent to a backend service for processing.

   ```
    You need to modify the generateMetadata function to generate images and metadata using the AI workflow and set values for the attributes based on the values then send the image and the metadata to backend
   ```

3. **Determining Minting Eligibility**: The component calculates whether the user is eligible to mint based on their DUX balance and the current flow rate.

4. **Dynamic Display**: Information about the NFT collection, including mint price and the user's current stream, is dynamically displayed.

## Additional Components

- `Deployments`: Lists all deployed NFT collections and allows navigation to their respective admin interfaces.
- `Navbar`: Navigation bar for the application.
- `MintingOptionsForm`: Form for creating a new NFT collection with various parameters.

## Libraries and Hooks Used

- `wagmi`: For interacting with Ethereum blockchain.
- `useContractRead`, `useContractWrite`, `usePrepareContractWrite`: Hooks from `wagmi` for reading and writing to smart contracts.
- `useParams`, `useAccount`: React Router and wagmi hooks for accessing URL parameters and user's Ethereum account.
- `useEffect`, `useState`: React hooks for managing component state and side effects.
- `ethers`: Library for interacting with the Ethereum blockchain and its ecosystem.
- `Apollo Client`: For making GraphQL queries to superfluid streams

## Usage

To use this dashboard:

1. Ensure you have a web3 provider like MetaMask installed
2. Connect your wallet.
3. Navigate through the dashboard to manage NFT collections, mint NFTs, handle finances, and manage streams.
4. Note some pages are only for Admin i.e owner of the contract
