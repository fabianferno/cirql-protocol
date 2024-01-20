import {
  EAS,
  Offchain,
  SchemaEncoder,
} from '@ethereum-attestation-service/eas-sdk'
import { Wallet, ethers } from 'ethers'

// Initialize the sdk with the address of the EAS Schema contract address
const schemaUID =
  '0x8320a0c90a5b15b2c9c9ff764a751f448e145a99b0de1d74e700931d2141bc14'

// Gets a default provider (in production use something else like infura/alchemy) // use mumbai
const provider: any = new ethers.providers.JsonRpcProvider(
  'https://polygon-mumbai.g.alchemy.com/v2/1iVNWMQkisa5Q3isadNXKzdfKL1LJGEN'
)

export default async function attestForUser(
  mnemonic: string,
  data: {
    userAFid: string
    userBFid: string
    entityId: string
    action: string
    misc: string
  }
) {
  // Connects an ethers style provider/signingProvider to perform read/write functions.
  // MUST be a signer to do write operations!
  const wallet: any = Wallet.fromMnemonic(mnemonic)
  const signer: any = wallet.connect(provider)

  console.log('Signer: ', signer.address)

  const eas = new EAS('0xaEF4103A04090071165F78D45D83A0C0782c2B2a', provider) // Mumbai testnet
  eas.connect(signer)
  // const offchain = await eas.getOffchain();

  // Initialize SchemaEncoder with the schema string
  const schemaEncoder = new SchemaEncoder(
    'string userAFid,string userBFid,string entityId,string action,string misc'
  )
  const encodedData = schemaEncoder.encodeData([
    { name: 'userAFid', value: data?.userAFid, type: 'string' },
    { name: 'userBFid', value: data?.userBFid, type: 'string' },
    { name: 'entityId', value: data?.entityId, type: 'string' },
    { name: 'action', value: data?.action, type: 'string' },
    { name: 'misc', value: data?.misc, type: 'string' },
  ])

  console.log('Encoded data: ', encodedData)

  const tx = await eas.attest({
    schema: schemaUID,
    data: {
      recipient: '0x0000000000000000000000000000000000000000',
      expirationTime: 0 as any,
      revocable: true, // Be aware that if your schema is not revocable, this MUST be false
      data: encodedData,
    },
  })
  const newAttestationUID = await tx.wait()
  console.log('New attestation UID:', newAttestationUID)

  return newAttestationUID
}
