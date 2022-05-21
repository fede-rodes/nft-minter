// import type { EndpointOutput } from '@sveltejs/kit'
// // import * as IPFS from 'ipfs-core'
// import { create } from 'ipfs-core'
// import type { DBItem } from '$types/index'

// /**
//  * @summary Upload item data to IPFS
//  */
// export const post = async ({ request }: { request: Request }): Promise<EndpointOutput> => {
//   try {
//     // Request body.
//     const item = (await request.json()) as DBItem

//     console.log({ item })

//     // TODO: watch this https://www.youtube.com/watch?v=mLEkACKx_sc&ab_channel=IPFS
//     // And try using a POST req
// //     import requests
// // import json

// // files = {
// // 'file': ('Congrats! You have uploaded your file to IPFS!'),
// // }

// // response = requests.post('https://ipfs.infura.io:5001/api/v0/add', files=files)
// // p = response.json()
// // hash = p['Hash']
// // print(hash)
// // Source: https://blog.infura.io/post/part-2-getting-started-with-ipfs-on-infura

//     // Upload to ipfs
//     const ipfs = create({
//       url: "https://ipfs.infura.io:5001/api/v0",
//     })
//     // const {cid} = await ipfs.add(JSON.stringify(item))
//     // const ipfs = await IPFS.create()
//     // ipfs.on('ready',  () => console.log('ready'));
//     // ipfs.on('error', err => console.log(err));
//     const { path } = await ipfs.add(JSON.stringify(item))

//     return {
//       status: 200,
//       body: {
//         cid: path,
//       }
//     }
//   } catch (err) {
//     return {
//       status: 503,
//       body: {
//         message: err,
//       },
//     }
//   }
// }

import type { EndpointOutput } from '@sveltejs/kit'
import * as IPFS from 'ipfs-core'
import type { DBItem } from '$types/index'

/**
 * @summary Upload item data to IPFS
 */
export const post = async ({ request }: { request: Request }): Promise<EndpointOutput> => {
  try {
    // Request body.
    const item = (await request.json()) as DBItem

    console.log({ item })

    // Upload to ipfs
    const ipfs = await IPFS.create()
    // ipfs.on('ready',  () => console.log('ready'));
    // ipfs.on('error', err => console.log(err));
    const { path } = await ipfs.add(JSON.stringify(item))

    return {
      status: 200,
      body: {
        cid: path,
      }
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
