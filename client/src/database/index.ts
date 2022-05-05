import fs from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import type { DBItem } from '$types/index'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

class DB {
  path = `${__dirname}/items.json`

  async read(): Promise<DBItem[]> {
    const data = await fs.readFile(this.path)
    return JSON.parse(data.toString('utf8')).items as DBItem[]
  }

  async write(items: DBItem[]): Promise<void> {
    const data = JSON.stringify({ items })
    await fs.writeFile(this.path, data)
  }
}

export const db = new DB()
