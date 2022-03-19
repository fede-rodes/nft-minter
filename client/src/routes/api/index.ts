// interface IStats {
//   nftsCount: number
//   maxSupply: number
// }

class API {
  // async getContractStats(fetch): Promise<IStats> {
  //   const res = (await fetch('/api/get-contract-stats')) as Response
  //   const json = await res.json()

  //   if (res.ok) {
  //     return json as IStats
  //   }

  //   throw new Error(JSON.stringify(json))
  // }

  async getNextMintableToken(): Promise<string> {
    const res = (await fetch('/api/get-next-mintable-token')) as Response
    const json = await res.json()

    if (res.ok) {
      return json.tokenURI as string
    }

    throw new Error(JSON.stringify(json))
  }

  async updateTokenData(
    tokenURI: string,
    status: 'MINTING' | 'MINTED',
    tokenId?: number,
  ): Promise<void> {
    const options: RequestInit = {
      method: 'POST',
      body: JSON.stringify({ tokenURI, status, tokenId }),
      headers: { 'content-type': 'application/json' },
    }
    const res = (await fetch('/api/update-token-data', options)) as Response
    const json = await res.json()

    if (res.ok) return

    throw new Error(JSON.stringify(json))
  }
}

export const api = new API()
