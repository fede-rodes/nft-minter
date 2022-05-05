import type { EndpointOutput } from '@sveltejs/kit'
import { db } from '$database/index'

/**
 * @summary Get next mintable item from DB
 */
// @type {import('@sveltejs/kit').RequestHandler}
export const get = async (): Promise<EndpointOutput> => {
  try {
    const items = await db.read()

    const item = items.find((item) => item.status === 'MINTABLE')

    if (item == null) throw new Error('All items have been minted')

    return {
      body: {
        item: JSON.stringify(item),
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
