import type { ContractTransaction } from 'ethers'
import { Contract, providers, BigNumber } from 'ethers'
import type { Signer } from 'ethers'
import artifact from '$artifacts/contracts/Minter.sol/Minter.json'
import type { INFT } from '$types/index'

export class Minter extends Contract {
  constructor(signerOrProvider?: providers.Provider | Signer) {
    super(import.meta.env.VITE_MINTER_CONTRACT_ADDRESS, artifact.abi, signerOrProvider)
  }

  // Mint a new token for the given tokenURI.
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

  // Query tokens by address.
  async tokensByAddress(address: string): Promise<INFT[]> {
    const tokenIds = ((await this.tokensOfOwner(address)) as BigNumber[]).map((bn) =>
      parseInt(bn.toString(), 10),
    )

    // Get token URIs.
    const promises: Promise<string>[] = []

    tokenIds.forEach((tokenId) => {
      promises.push(this.tokenURI(tokenId) as Promise<string>)
    })

    const tokenURIs = await Promise.all(promises)

    const nfts = tokenIds.map((tokenId, index) => ({
      tokenId,
      tokenURI: tokenURIs[index],
    })) as INFT[]

    return nfts
  }

  // Total number of tokens minted so far.
  async tokensCount(): Promise<number> {
    return parseInt(((await this.count()) as BigNumber).toString(), 10)
  }

  // Tokens MAX_SUPPLY.
  async maxSupply(): Promise<number> {
    return parseInt(((await this.MAX_SUPPLY()) as BigNumber).toString(), 10)
  }
}
