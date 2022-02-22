import { db } from '$database/index'

// Update token status and possibly tokenId for the given tokenURI.

/** @type {import('@sveltejs/kit').RequestHandler} */
export const post = async ({ request }) => {
  try {
    const body = await request.json()

    const { tokenURI, status, tokenId } = body

    const nfts = await db.read()
    const index = nfts.findIndex((nft) => nft.tokenURI === tokenURI)

    nfts[index].status = status

    if (tokenId != null) {
      nfts[index].tokenId = tokenId
    }

    await db.write(nfts)

    return {
      status: 200,
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
