import fs from 'fs/promises'

interface INFT {
  tokenId?: number
  tokenURI: string
  status: 'MINTABLE' | 'MINTING' | 'MINTED'
}

class DB {
  // TODO: fix path
  path = '/home/federodes/Workspace/nft-minter/client/src/database/nfts.json'

  async read(): Promise<INFT[]> {
    const data = await fs.readFile(this.path)
    return JSON.parse(data.toString('utf8')).nfts as INFT[]
  }

  async write(nfts: INFT[]): Promise<void> {
    const data = JSON.stringify({ nfts })
    await fs.writeFile(this.path, data)
  }
}

export const db = new DB()
