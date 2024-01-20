// import { ethers } from "hardhat"
// import { CirqlProtocol } from "../typechain-types"

// export async function main(args: any[]) {
//   const CirqlProtocol: CirqlProtocol = await ethers.getContract("CirqlProtocol")

//   const data = await CirqlProtocol.tokenURI(args[0])
//   let decoded = Buffer.from(data.replace("data:application/json;base64,", ""), "base64").toString()
//   let decodedJSON = JSON.parse(decoded)
//   console.log(decodedJSON)
// }

// main([
//   54255, // tokenId
// ])
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error)
//     process.exit(1)
//   })
