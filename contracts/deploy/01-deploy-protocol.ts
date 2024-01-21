import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../helper-functions"
import { parseEther } from "ethers/lib/utils"
import { AaveV3Sepolia } from "@bgd-labs/aave-address-book" // import specific pool
import { networkConfig, developmentChains } from "../helper-hardhat-config"

const deployProtocol: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  log("----------------------------------------------------")
  log("Deploying Protocol and waiting for confirmations...")

  // GHO token contract
  let GHO_Token = "0xc4bF5CbDaBE595361438F8c6a187bDc330539c60"
  let daiToken = "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357"
  let pool = AaveV3Sepolia.POOL // 0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951
  let ghoDebtToken = "0xd4FEA5bD40cE7d0f7b269678541fF0a95FCb4b68"
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
