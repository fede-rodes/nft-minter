import { db } from '$database/index'

// Update token status and possibly tokenId for the given tokenURI.

// TODO: add types
/** @type {import('@sveltejs/kit').RequestHandler} */
export const post = async ({ request }) => {
  try {
    const { tokenURI, status, tokenId } = await request.json() // request body

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
