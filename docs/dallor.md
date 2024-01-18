# Dallor Super Token Documentation

## Overview

The `Dallor` contract is a Solidity smart contract for creating a capped, mintable pure super token. It inherits from `SuperTokenBase` and `Ownable` (from OpenZeppelin). The contract is designed to create a token with a maximum supply limit, ensuring that the total supply of tokens never exceeds this cap.
The contract is based on the custom-supertoken-repo of Superfluid for deploying a custoim super token

## Compilation and Deployment Documentation for Dallor Contract

This guide provides instructions for compiling and deploying the `Dallor` smart contract using Truffle on the Mumbai testnet. It assumes you have a `.env` file with specific environment variables set.

## Prerequisites

- Node.js and npm installed.
- Truffle installed globally (`npm install -g truffle`).
- An Ethereum wallet with a private key.
- A provider URL for the Mumbai testnet.
- A Polygonscan API key for verifying the contract.

## Environment Setup

Create a `.env` file in your project root with the following variables:

```plaintext
PRIVATE_KEY=''
MUMBAI_PROVIDER_URL=''
POLYGONSCAN_API_KEY=''
```

Fill in the values:

- `PRIVATE_KEY`: Your Ethereum wallet's private key (without the '0x' prefix).
- `MUMBAI_PROVIDER_URL`: Your Infura or Alchemy API URL for the Mumbai testnet.
- `POLYGONSCAN_API_KEY`: Your API key for Polygonscan.

## Step 1: Compiling the Contract

Run the following command in your project directory to compile the `Dallor` contract:

```bash
npx truffle compile
```

This command compiles all your smart contracts in the project. Ensure that the `Dallor` contract and its dependencies are correctly placed in your project's `contracts` directory.

## Step 2: Deploying the Contract

Set the contract name and initialization arguments as environment variables:

```bash
export CONTRACT=Dallor
export INIT_ARGS="Dallor","DUX","240000000000000000000000000"
```

These variables define the contract to deploy (`Dallor`) and its constructor arguments (name, symbol, and max supply).

Run the deployment script with:

```bash
npx truffle exec --network mumbai scripts/deploy.js
```

This command executes the `deploy.js` script in the `scripts` directory on the Mumbai testnet. Ensure that your `deploy.js` script is correctly set up to deploy the `Dallor` contract using the provided `INIT_ARGS`.

- Example Output

```
Using network 'mumbai'.

contructor args: []
initialize args: [ 'Dallor', 'DUX', '240000000000000000000000000' ]
SuperTokenFactory address 0x200657E2f123761662567A1744f9ACAe50dF47E6
Deploy Proxy contract: started
Deploy Proxy contract: done, gas used 997302, gas price 2.500000018 Gwei
Proxy deployed at: 0xD862d46F838Bab450fad2E9da4bE0FA0Fda6e538
Initialize Token contract: started
Initialize Token contract: done, gas used 234381, gas price 2.500000018 Gwei
All done, token deployed and initialized at: 0xD862d46F838Bab450fad2E9da4bE0FA0Fda6e538
```

## Step 3: verify on polygonscan

- Is This a Proxy?: On the Polygonscan page for the proxy contract, you might see an option like "Is this a Proxy?". Clicking this allows Polygonscan to recognize the contract as a proxy and link it to the implementation contract.
- Verify Proxy Pattern: This step is usually automatic. Polygonscan will detect the proxy pattern and display relevant information, allowing users to interact with the contract through the proxy.
