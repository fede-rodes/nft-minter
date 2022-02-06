import { Contract } from 'ethers'
import artifact from '$artifacts/contracts/Minter.sol/Minter.json'

// TODO: read from config or artifacts
const address = '0x5fbdb2315678afecb367f032d93f642f64180aa3'

// TODO: add types
// TODO: maybe use a class
export function minterContract(provider, signer = null): Contract {
  return new Contract(address, artifact.abi, signer != null ? signer : provider)
}
