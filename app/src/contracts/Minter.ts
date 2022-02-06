import { Contract, providers } from 'ethers'
import type { Signer } from 'ethers'
import artifact from '$artifacts/contracts/Minter.sol/Minter.json'

export class MinterContract extends Contract {
  constructor(signerOrProvider?: providers.Provider | Signer) {
    super(import.meta.env.VITE_MINTER_CONTRACT_ADDRESS, artifact.abi, signerOrProvider)
  }
}
