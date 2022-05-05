export interface NFT {
  tokenId: number
  tokenURI: string
}

export interface DBItem {
  id: string
  description: string
  external_url: string
  image: string
  name: string
  attributes: { trait_type: string; value: string | number }[]
  status: 'MINTABLE' | 'MINTING' | 'MINTED'
  tokenId?: number
}
