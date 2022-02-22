import { db } from '$database/index'

// Get next mintable NFT by simulating a DB read...

/** @type {import('@sveltejs/kit').RequestHandler} */
export const get = async () => {
  try {
    const nfts = await db.read()

    const nft = nfts.find((nft) => nft.status === 'MINTABLE')

    return {
      body: {
        nft,
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
