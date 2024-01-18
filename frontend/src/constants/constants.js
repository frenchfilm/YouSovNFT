export const NFTCollectionFactoryAddress = "0x2C290f1D0cCc991FE7E777f4ce1e7c926A1D005E";

export const DUXAddress = "0xD862d46F838Bab450fad2E9da4bE0FA0Fda6e538";

export const NFTCollectionFactoryABI = [
	{
		"type": "constructor",
		"inputs": [
			{
				"name": "_dux",
				"type": "address",
				"internalType": "contract ISuperToken"
			}
		],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "createNFTCollection",
		"inputs": [
			{
				"name": "config",
				"type": "tuple",
				"internalType": "struct eSovCollection.CollectionConfig",
				"components": [
					{
						"name": "_name",
						"type": "string",
						"internalType": "string"
					},
					{
						"name": "_symbol",
						"type": "string",
						"internalType": "string"
					},
					{
						"name": "mintPrice",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "specialMintPrice",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "batchMintAmount",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "maxPerWallet",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "maxTotalSupply",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "imageSource",
						"type": "uint8",
						"internalType": "enum eSovCollection.ImageSourceType"
					},
					{
						"name": "isSBT",
						"type": "bool",
						"internalType": "bool"
					},
					{
						"name": "specialCode",
						"type": "uint8",
						"internalType": "uint8"
					},
					{
						"name": "flowRate",
						"type": "int96",
						"internalType": "int96"
					},
					{
						"name": "collectionAttributes",
						"type": "string[]",
						"internalType": "string[]"
					}
				]
			}
		],
		"outputs": [
			{
				"name": "",
				"type": "address",
				"internalType": "address"
			}
		],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "dux",
		"inputs": [],
		"outputs": [
			{
				"name": "",
				"type": "address",
				"internalType": "contract ISuperToken"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "eSovInstances",
		"inputs": [
			{
				"name": "",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"outputs": [
			{
				"name": "",
				"type": "address",
				"internalType": "address"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "geteSovInstances",
		"inputs": [],
		"outputs": [
			{
				"name": "",
				"type": "address[]",
				"internalType": "address[]"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "owner",
		"inputs": [],
		"outputs": [
			{
				"name": "",
				"type": "address",
				"internalType": "address"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "renounceOwnership",
		"inputs": [],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "transferOwnership",
		"inputs": [
			{
				"name": "newOwner",
				"type": "address",
				"internalType": "address"
			}
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "event",
		"name": "OwnershipTransferred",
		"inputs": [
			{
				"name": "previousOwner",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "newOwner",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "eSovNFTCollectionCreated",
		"inputs": [
			{
				"name": "owner",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "nftCollection",
				"type": "address",
				"indexed": false,
				"internalType": "address"
			}
		],
		"anonymous": false
	}
]

export const NFTCollectionABI = [
	{
		"type": "constructor",
		"inputs": [
			{
				"name": "config",
				"type": "tuple",
				"internalType": "struct eSovCollection.CollectionConfig",
				"components": [
					{
						"name": "_name",
						"type": "string",
						"internalType": "string"
					},
					{
						"name": "_symbol",
						"type": "string",
						"internalType": "string"
					},
					{
						"name": "mintPrice",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "specialMintPrice",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "batchMintAmount",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "maxPerWallet",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "maxTotalSupply",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "imageSource",
						"type": "uint8",
						"internalType": "enum eSovCollection.ImageSourceType"
					},
					{
						"name": "isSBT",
						"type": "bool",
						"internalType": "bool"
					},
					{
						"name": "specialCode",
						"type": "uint8",
						"internalType": "uint8"
					},
					{
						"name": "flowRate",
						"type": "int96",
						"internalType": "int96"
					},
					{
						"name": "collectionAttributes",
						"type": "string[]",
						"internalType": "string[]"
					}
				]
			},
			{
				"name": "_owner",
				"type": "address",
				"internalType": "address"
			},
			{
				"name": "_dux",
				"type": "address",
				"internalType": "contract ISuperToken"
			}
		],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "_collectionAttributes",
		"inputs": [
			{
				"name": "",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"outputs": [
			{
				"name": "",
				"type": "string",
				"internalType": "string"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "adminMint",
		"inputs": [],
		"outputs": [],
		"stateMutability": "payable"
	},
	{
		"type": "function",
		"name": "approve",
		"inputs": [
			{
				"name": "to",
				"type": "address",
				"internalType": "address"
			},
			{
				"name": "tokenId",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "balanceOf",
		"inputs": [
			{
				"name": "owner",
				"type": "address",
				"internalType": "address"
			}
		],
		"outputs": [
			{
				"name": "",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "batchMint",
		"inputs": [],
		"outputs": [],
		"stateMutability": "payable"
	},
	{
		"type": "function",
		"name": "batchMintAmount",
		"inputs": [],
		"outputs": [
			{
				"name": "",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "cancelAllStreams",
		"inputs": [],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "cancelStream",
		"inputs": [
			{
				"name": "streamAddress",
				"type": "address",
				"internalType": "address"
			}
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "dux",
		"inputs": [],
		"outputs": [
			{
				"name": "",
				"type": "address",
				"internalType": "contract ISuperToken"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "flowRate",
		"inputs": [],
		"outputs": [
			{
				"name": "",
				"type": "int96",
				"internalType": "int96"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "gainDux",
		"inputs": [
			{
				"name": "amount",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "getApproved",
		"inputs": [
			{
				"name": "tokenId",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"outputs": [
			{
				"name": "",
				"type": "address",
				"internalType": "address"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "getCollectionAttributes",
		"inputs": [],
		"outputs": [
			{
				"name": "",
				"type": "string[]",
				"internalType": "string[]"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "getCurrentFlowRate",
		"inputs": [
			{
				"name": "streamAddress",
				"type": "address",
				"internalType": "address"
			}
		],
		"outputs": [
			{
				"name": "",
				"type": "int96",
				"internalType": "int96"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "getCurrentTokenId",
		"inputs": [],
		"outputs": [
			{
				"name": "",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "getduxBalance",
		"inputs": [],
		"outputs": [
			{
				"name": "",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "imageSource",
		"inputs": [],
		"outputs": [
			{
				"name": "",
				"type": "uint8",
				"internalType": "enum eSovCollection.ImageSourceType"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "isApprovedForAll",
		"inputs": [
			{
				"name": "owner",
				"type": "address",
				"internalType": "address"
			},
			{
				"name": "operator",
				"type": "address",
				"internalType": "address"
			}
		],
		"outputs": [
			{
				"name": "",
				"type": "bool",
				"internalType": "bool"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "isSBT",
		"inputs": [],
		"outputs": [
			{
				"name": "",
				"type": "bool",
				"internalType": "bool"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "maxPerWallet",
		"inputs": [],
		"outputs": [
			{
				"name": "",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "maxTotalSupply",
		"inputs": [],
		"outputs": [
			{
				"name": "",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "mint",
		"inputs": [],
		"outputs": [],
		"stateMutability": "payable"
	},
	{
		"type": "function",
		"name": "mintPrice",
		"inputs": [],
		"outputs": [
			{
				"name": "",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "name",
		"inputs": [],
		"outputs": [
			{
				"name": "",
				"type": "string",
				"internalType": "string"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "owner",
		"inputs": [],
		"outputs": [
			{
				"name": "",
				"type": "address",
				"internalType": "address"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "ownerOf",
		"inputs": [
			{
				"name": "tokenId",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"outputs": [
			{
				"name": "",
				"type": "address",
				"internalType": "address"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "renounceOwnership",
		"inputs": [],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "safeTransferFrom",
		"inputs": [
			{
				"name": "from",
				"type": "address",
				"internalType": "address"
			},
			{
				"name": "to",
				"type": "address",
				"internalType": "address"
			},
			{
				"name": "tokenId",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "safeTransferFrom",
		"inputs": [
			{
				"name": "from",
				"type": "address",
				"internalType": "address"
			},
			{
				"name": "to",
				"type": "address",
				"internalType": "address"
			},
			{
				"name": "tokenId",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "_data",
				"type": "bytes",
				"internalType": "bytes"
			}
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "setApprovalForAll",
		"inputs": [
			{
				"name": "operator",
				"type": "address",
				"internalType": "address"
			},
			{
				"name": "approved",
				"type": "bool",
				"internalType": "bool"
			}
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "specialCode",
		"inputs": [],
		"outputs": [
			{
				"name": "",
				"type": "uint8",
				"internalType": "uint8"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "specialMintPrice",
		"inputs": [],
		"outputs": [
			{
				"name": "",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "supportsInterface",
		"inputs": [
			{
				"name": "interfaceId",
				"type": "bytes4",
				"internalType": "bytes4"
			}
		],
		"outputs": [
			{
				"name": "",
				"type": "bool",
				"internalType": "bool"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "symbol",
		"inputs": [],
		"outputs": [
			{
				"name": "",
				"type": "string",
				"internalType": "string"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "tokenByIndex",
		"inputs": [
			{
				"name": "index",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"outputs": [
			{
				"name": "",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "tokenOfOwnerByIndex",
		"inputs": [
			{
				"name": "owner",
				"type": "address",
				"internalType": "address"
			},
			{
				"name": "index",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"outputs": [
			{
				"name": "",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "tokenURI",
		"inputs": [
			{
				"name": "tokenId",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"outputs": [
			{
				"name": "",
				"type": "string",
				"internalType": "string"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "totalSupply",
		"inputs": [],
		"outputs": [
			{
				"name": "",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "transferFrom",
		"inputs": [
			{
				"name": "from",
				"type": "address",
				"internalType": "address"
			},
			{
				"name": "to",
				"type": "address",
				"internalType": "address"
			},
			{
				"name": "tokenId",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "transferOwnership",
		"inputs": [
			{
				"name": "newOwner",
				"type": "address",
				"internalType": "address"
			}
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "withdrawDux",
		"inputs": [
			{
				"name": "amount",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "withdrawEther",
		"inputs": [],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "event",
		"name": "Approval",
		"inputs": [
			{
				"name": "owner",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "approved",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "tokenId",
				"type": "uint256",
				"indexed": true,
				"internalType": "uint256"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "ApprovalForAll",
		"inputs": [
			{
				"name": "owner",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "operator",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "approved",
				"type": "bool",
				"indexed": false,
				"internalType": "bool"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "OwnershipTransferred",
		"inputs": [
			{
				"name": "previousOwner",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "newOwner",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "Transfer",
		"inputs": [
			{
				"name": "from",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "to",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "tokenId",
				"type": "uint256",
				"indexed": true,
				"internalType": "uint256"
			}
		],
		"anonymous": false
	}
]

export const APPROVEDUXABI = [
	{
		inputs: [
			{
				internalType: "address",
				name: "to",
				type: "address",
			},
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256",
			},
		],
		name: "approve",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "account", type: "address" },
			{ internalType: "address", name: "spender", type: "address" },
		],
		name: "allowance",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{},
];
