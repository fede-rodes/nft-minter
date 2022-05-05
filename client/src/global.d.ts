/// <reference types="@sveltejs/kit" />

interface Window {
  ethereum: any
  web3: any
}

interface ImportMetaEnv {
  VITE_CHAIN_ID: string
  VITE_INFURA_PROJECT_ID?: string
  VITE_MINTER_CONTRACT_ADDRESS: string
  VITE_COLLECTION_NAME?: string
}
