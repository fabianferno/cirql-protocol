import { CirqlProtocol, ICreditDelegationToken, IERC20, IPool } from "../../typechain-types"
import { deployments, ethers, network } from "hardhat"
import { assert } from "chai"
import { AaveV3Sepolia } from "@bgd-labs/aave-address-book" // import specific pool
import { parseEther } from "ethers/lib/utils"

describe("CirqlProtocol Mint Flow", () => {
  let CirqlProtocol: CirqlProtocol
  let Pool: IPool
  let DaiToken: IERC20
  let ghoDebtToken: ICreditDelegationToken

  beforeEach(async () => {
    await deployments.fixture(["all"])
    CirqlProtocol = await ethers.getContract("CirqlProtocol")
    Pool = await ethers.getContractAt("IPool", AaveV3Sepolia.POOL)
    DaiToken = await ethers.getContractAt("IERC20", AaveV3Sepolia.ASSETS.DAI.UNDERLYING)
    ghoDebtToken = await ethers.getContractAt(
      "ICreditDelegationToken",
      AaveV3Sepolia.ASSETS.GHO.V_TOKEN
    )
  })

  it("Lend", async () => {
    const [owner, alice, bob] = await ethers.getSigners()

    // Fund deployer wallet with DAI by sending DAI from the whale
    //  impersonating the whale
    let DAI_WHALE = "0x9Dc7990136EB33339522b57260E07090EB540232"
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [DAI_WHALE],
    })
    // Send gas to whale
    await owner.sendTransaction({
      to: DAI_WHALE,
      value: parseEther("1"),
    })
    const signer = await ethers.getSigner(DAI_WHALE)

    console.log("Whale balance", ethers.utils.formatEther(await signer.getBalance()))
    let DAI = await ethers.getContractAt("IERC20", DaiToken.address)
    // Send 100 DAI to deployer
    const recieptTx = await signer.sendTransaction({
      to: DAI.address,
      value: 0,
      data: DAI.interface.encodeFunctionData("transfer", [owner.address, parseEther("1000")]),
    })
    await recieptTx.wait()
    console.log(`Sent 1000 DAI to ${owner.address}`)
    console.log(`Transaction successful with hash: ${recieptTx.hash}`)

    // Approve dai to be spent by the protocol
    const approveTx = await DaiToken.approve(CirqlProtocol.address, parseEther("1000"))
    await approveTx.wait(1)
    console.log(`Approval successful with hash: ${approveTx.hash}`)

    // Deposit dai into the protocol
    const depositTx = await CirqlProtocol._deposit(parseEther("1000"))
    await depositTx.wait(1)

    // Get the current balance of the protocol
    const balance = await CirqlProtocol.totalSupply()
    console.log("balance", balance.toString())

    // Get the current balance of the user
    const userBalance = await CirqlProtocol.balanceOf(owner.address)
    console.log("userBalance", userBalance.toString())
  })
})
