import type { INFT } from '$types/index'

class API {
  async getNextMintableToken(): Promise<string> {
    const res = await fetch('/api/get-next-mintable-token')
    return (await res.json()).tokenURI as string
  }

  async updateTokenData(
    tokenURI: string,
    status: 'MINTING' | 'MINTED',
    tokenId?: number,
  ): Promise<void> {
    await fetch('/api/update-token-data', {
      method: 'POST',
      body: JSON.stringify({ tokenURI, status, tokenId }),
      headers: { 'content-type': 'application/json' },
    })
  }
}

export const api = new API()
