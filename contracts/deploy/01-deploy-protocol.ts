import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../helper-functions"
import { parseEther } from "ethers/lib/utils"
import { AaveV3Sepolia } from "@bgd-labs/aave-address-book" // import specific pool
import { networkConfig, developmentChains } from "../helper-hardhat-config"
import { ethers } from "hardhat"

const deployProtocol: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  log("----------------------------------------------------")
  log("Deploying Protocol and waiting for confirmations...")

  // GHO token contract
  let GHO_Token = AaveV3Sepolia.ASSETS.GHO.UNDERLYING
  let daiToken = AaveV3Sepolia.ASSETS.DAI.UNDERLYING
  let pool = AaveV3Sepolia.POOL
  let ghoDebtToken = AaveV3Sepolia.ASSETS.GHO.V_TOKEN
  const Contract = await deploy("CirqlProtocol", {
    from: deployer,
    args: [daiToken, "CirqlToken", "CQL", pool, ghoDebtToken],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name]?.blockConfirmations || 1,
  })
  log(`Contract at ${Contract.address}`)

  // Verifications
  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    // Wait for 5 block confirmations
    log("Waiting for 5 block confirmations before verifying...")
    await hre.ethers.provider.waitForTransaction(Contract.transactionHash || "", 5)

    await verify(Contract.address, network.name, [
      // args
      daiToken,
      "CirqlToken",
      "CQL",
      pool,
      ghoDebtToken,
    ])
  }
}

export default deployProtocol
deployProtocol.tags = ["all", "Protocol"]
