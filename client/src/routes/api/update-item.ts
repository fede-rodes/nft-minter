import type { EndpointOutput } from '@sveltejs/kit'
import type { DBItem } from '$types/index'
import { db } from '$database/index'

/**
 * @summary Update item's data on DB
 */
export const post = async ({ request }: { request: Request }): Promise<EndpointOutput> => {
  try {
    // Request body.
    const { id, status, tokenId } = (await request.json()) as DBItem

    const items = await db.read()

    const index = items.findIndex((item) => item.id === id)

    items[index].status = status

    if (tokenId != null) {
      items[index].tokenId = tokenId
    }

    await db.write(items)

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
