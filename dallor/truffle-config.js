require("dotenv").config()
const HDWalletProvider = require("@truffle/hdwallet-provider")

module.exports = {
	plugins: ["truffle-plugin-verify"],
	networks: {
		// Polygon mumbai testnet
		mumbai: {
			provider: () =>
			new HDWalletProvider({
				url: process.env.MUMBAI_PROVIDER_URL,
				privateKeys: [process.env.PRIVATE_KEY]
			}),
			network_id: 80001,
			gasPrice: 50e9, // 50 gwei
			skipDryRun: false
		},
	},
	mocha: {
		timeout: 100000
	},
	// Configure your compilers
	compilers: {
		solc: {
			version: "0.8.14"
		}
	},
	api_keys: {
		etherscan: process.env.ETHERSCAN_API_KEY,
		polygonscan: process.env.POLYGONSCAN_API_KEY,
		snowtrace: process.env.SNOWTRACE_API_KEY,
		optimistic_etherscan: process.env.OPTIMISTIC_API_KEY,
		bscscan: process.env.BSCSCAN_API_KEY,
		arbiscan: process.env.ARBISCAN_API_KEY,
		gnosisscan: process.env.GNOSISSCAN_API_KEY
	}
}
