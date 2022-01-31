import { BigNumber, Contract, providers } from 'ethers'
import artifact from '$artifacts/contracts/Greeter.sol/Greeter.json'

// TODO: read from config or artifacts
const address = '0x5fbdb2315678afecb367f032d93f642f64180aa3'

// TODO: add types
export const GreeterContract = (signer, provider) => {
  return new Contract(address, artifact.abi, signer != null ? signer : provider)
}
