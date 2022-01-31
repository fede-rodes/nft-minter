const INFURA_PROJECT_ID = import.meta.env.VITE_INFURA_PROJECT_ID
const CHAIN_ID = parseInt(import.meta.env.VITE_CHAIN_ID, 10)

const RPC_URLS = {
  1: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
  4: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
  42: `https://kovan.infura.io/v3/${INFURA_PROJECT_ID}`,
  1337: 'http://127.0.0.1:8545',
}

export const RPC_URL = RPC_URLS[CHAIN_ID]
