import { run } from "hardhat"

const verify = async (contractAddress: string, network: string = "mumbai", args: any[]) => {
  console.log("Verifying contract...")
  try {
    await run("verify:verify", {
      network: network,
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (e: any) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified!")
    } else {
      console.log(e)
    }
  }
}

export default verify
