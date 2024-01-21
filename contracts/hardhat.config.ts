import "@typechain/hardhat"
import "@nomiclabs/hardhat-waffle"
// import "@nomiclabs/hardhat-etherscan"
import "@nomiclabs/hardhat-ethers"
import "hardhat-gas-reporter"
import "dotenv/config"
import "solidity-coverage"
import "hardhat-deploy"
import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-verify"

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || ""
// const SEPOLIA_RPC_URL =
//   process.env.SEPOLIA_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY"
const PRIVATE_KEY = process.env.PRIVATE_KEY || "privateKey"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      allowUnlimitedContractSize: true,
      gas: 2100000,
      gasPrice: 8000000000,
      forking: {
        url: process.env.SEPOLIA_RPC_URL || "",
      },
    },
    localhost: {
      chainId: 31337,
      allowUnlimitedContractSize: true,
    },
    mumbai: {
      chainId: 80001,
      allowUnlimitedContractSize: true,
      gas: 2100000,
      gasPrice: 8000000000,
      url: "https://polygon-mumbai-bor.publicnode.com	",
      accounts: [process.env.PRIVATE_KEY || ""],
    },
    base: {
      allowUnlimitedContractSize: true,
      // chainId: 8453,
      gas: "auto",
      gasPrice: 1000000000,
      url: "https://mainnet.base.org",
      accounts: [process.env.PRIVATE_KEY || ""],
    },
    baseGoerli: {
      chainId: 84531,
      allowUnlimitedContractSize: true,
      gas: 2100000,
      gasPrice: 8000000000,
      url: "https://goerli.base.org",
      accounts: [process.env.PRIVATE_KEY || ""],
    },
  },
  solidity: {
    version: "0.8.23",
    settings: {
      evmVersion: "paris",
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  etherscan: {
    apiKey: {
      polygonMumbai: ETHERSCAN_API_KEY,
      polygon: ETHERSCAN_API_KEY,
      base: ETHERSCAN_API_KEY,
      baseGoerli: ETHERSCAN_API_KEY,
      goerli: ETHERSCAN_API_KEY,
    },
  },
  sourcify: {
    enabled: true,
    // Optional: specify a different Sourcify server
    apiUrl: "https://sourcify.dev/server",
    // Optional: specify a different Sourcify repository
    browserUrl: "https://repo.sourcify.dev",
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    // coinmarketcap: COINMARKETCAP_API_KEY,
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
  },
  mocha: {
    timeout: 200000, // 200 seconds max for running tests
  },
}

export default config
