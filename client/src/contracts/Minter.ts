import type { ContractTransaction } from 'ethers'
import { Contract, providers } from 'ethers'
import type { Signer } from 'ethers'
import artifact from '$artifacts/contracts/Minter.sol/Minter.json'

export class Minter extends Contract {
  constructor(signerOrProvider?: providers.Provider | Signer) {
    super(import.meta.env.VITE_MINTER_CONTRACT_ADDRESS, artifact.abi, signerOrProvider)
  }

  async mint(tokenURI: string): Promise<number> {
    const tx = (await this.mintNFT(tokenURI, {
      gasLimit: 2000000, // TODO: set gasLimit
    })) as ContractTransaction

    const txReceipt = await tx.wait()
    const event = txReceipt?.events ? txReceipt.events[0] : null
    const value = event?.args ? event.args[2] : null
    const tokenId = value.toNumber() as number

    return tokenId
  }
}
