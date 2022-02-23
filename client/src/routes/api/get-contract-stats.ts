import { providers, BigNumber } from 'ethers'
import { Minter } from '$contracts/Minter'

const CHAIN_ID = parseInt(import.meta.env.VITE_CHAIN_ID, 10)
const INFURA_PROJECT_ID = import.meta.env.VITE_INFURA_PROJECT_ID

const RPC_URLS = {
  1: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
  4: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
  42: `https://kovan.infura.io/v3/${INFURA_PROJECT_ID}`,
  1337: 'http://127.0.0.1:8545',
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export const get = async () => {
  // Using a `network` provider to query data regardless of the user logged in state.
  // By using a `network` provider we can perform calls to the Ethereum blockchain (for
  // instance getting some public variable's value) but we cannot sign any transactions.
  const provider = new providers.JsonRpcProvider(RPC_URLS[CHAIN_ID])

  try {
    const minter = new Minter(provider)

    // Number of NFTs minted so far.
    const nftsCount = parseInt(((await minter.count()) as BigNumber).toString(), 10)

    // Get tokens MAX_SUPPLY
    const maxSupply = parseInt(((await minter.MAX_SUPPLY()) as BigNumber).toString(), 10)

    return {
      body: {
        nftsCount,
        maxSupply,
      },
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
