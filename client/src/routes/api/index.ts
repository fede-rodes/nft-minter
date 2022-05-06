// interface IStats {
//   nftsCount: number
//   maxSupply: number
// }

class API {
  // async getContractStats(fetch: any): Promise<IStats> {
  //   const res = (await fetch('/api/get-contract-stats')) as Response
  //   const json = await res.json()

  //   if (res.ok) {
  //     return json as IStats
  //   }

  //   throw new Error(JSON.stringify(json))
  // }

  async getItem(): Promise<string> {
    const res = (await fetch('/api/get-item')) as Response
    const json = await res.json()

    console.log({ json, ok: res.ok })

    if (res.ok) {
      return json.item as string
    }

    throw new Error(JSON.stringify(json))
  }

  async updateItem(id: string, status: 'MINTING' | 'MINTED', tokenId?: number): Promise<void> {
    const options: RequestInit = {
      method: 'POST',
      body: JSON.stringify({ id, status, tokenId }),
      headers: { 'content-type': 'application/json' },
    }
    const res = (await fetch('/api/update-item', options)) as Response
    const json = await res.json()

    if (res.ok) return

    throw new Error(JSON.stringify(json))
  }
}

export const api = new API()
