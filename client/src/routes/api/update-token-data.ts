import type { EndpointOutput } from '@sveltejs/kit'
import { db } from '$database/index'

interface IUpdateTokenDataBody {
  tokenURI: string
  status: 'MINTING' | 'MINTED'
  tokenId?: number
}

/**
 * @summary Update token status and possibly tokenId for the given tokenURI.
 */
export const post = async ({ request }: { request: Request }): Promise<EndpointOutput> => {
  try {
    // Request body.
    const { tokenURI, status, tokenId } = (await request.json()) as IUpdateTokenDataBody

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
