import type { EndpointOutput } from '@sveltejs/kit'
import { db } from '$database/index'

// Get next mintable NFT by simulating a DB read...

/** @type {import('@sveltejs/kit').RequestHandler} */
export const get = async (): Promise<EndpointOutput> => {
  try {
    const nfts = await db.read()

    const nft = nfts.find((nft) => nft.status === 'MINTABLE')

    if (nft == null) throw new Error('All NFTs have been minted')

    return {
      body: {
        tokenURI: nft.tokenURI,
      },
    }
  } catch (err) {
    return {
      status: 503,
      body: {
        message: err,
      },
    }
  }
}
