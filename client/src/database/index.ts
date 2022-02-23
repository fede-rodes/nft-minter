import fs from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface INFT {
  tokenId?: number
  tokenURI: string
  status: 'MINTABLE' | 'MINTING' | 'MINTED'
}

class DB {
  path = `${__dirname}/nfts.json`

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
