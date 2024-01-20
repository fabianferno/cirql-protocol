import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../helper-functions"
import { parseEther } from "ethers/lib/utils"
import { networkConfig, developmentChains } from "../helper-hardhat-config"

const deployNFT: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  log("----------------------------------------------------")
  log("Deploying NFT and waiting for confirmations...")
  const owner = "0x23B7A53ecfd93803C63b97316D7362eae59C55B6"
  const mintFee = parseEther("0") // Wei 100000000000000
  const NFT = await deploy("CirqlProtocol", {
    from: deployer,
    args: [
      // Owner
      owner,
      // Mint Fee
      mintFee,
    ],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name]?.blockConfirmations || 1,
  })
  log(`NFT at ${NFT.address}`)
  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    // Wait for 5 block confirmations
    log("Waiting for 5 block confirmations before verifying...")
    await hre.ethers.provider.waitForTransaction(NFT.transactionHash || "", 5)

    await verify(NFT.address, network.name, [
      // Owner
      owner,
      // Mint Fee
      mintFee,
    ])
  }
}

export default deployNFT
deployNFT.tags = ["all", "NFT"]
