<script lang="ts">
  import type { BigNumber } from 'ethers'
  import { signer, signerAddress } from 'svelte-ethers-store'
  import { Minter } from '$contracts/Minter'
  import { Wallet } from '$components/wallet'
  import { NFT } from '$components/nft'

  const COLLECTION_NAME = import.meta.env.VITE_COLLECTION_NAME

  interface INFT {
    tokenId: number
    tokenURI: string
  }

  // TODO: this should come from the server in order to know what's the
  // next NFT to be minted. Other apporach could be trying to set baseURI
  // inside the Minter smart contract and forget about passing the
  // tokenURI from the client.
  const NFTs: INFT[] = [
    {
      tokenId: 1,
      tokenURI: 'ipfs://QmXhfZ3BcBdfwT7tPxxHScYG5ZzDbq36NUdjKFYm6wTEZJ/1.json',
    },
    {
      tokenId: 2,
      tokenURI: 'ipfs://QmXhfZ3BcBdfwT7tPxxHScYG5ZzDbq36NUdjKFYm6wTEZJ/2.json',
    },
    {
      tokenId: 3,
      tokenURI: 'ipfs://QmXhfZ3BcBdfwT7tPxxHScYG5ZzDbq36NUdjKFYm6wTEZJ/3.json',
    },
    {
      tokenId: 4,
      tokenURI: 'ipfs://QmXhfZ3BcBdfwT7tPxxHScYG5ZzDbq36NUdjKFYm6wTEZJ/4.json',
    },
  ]

  let tokenIds: number[] = []

  $: nfts = NFTs.filter(({ tokenId }) => tokenIds.includes(tokenId))
  $: balance = nfts.length || 0

  const fetchNFTs = async (): Promise<void> => {
    if ($signer == null || $signerAddress == null) {
      nfts = []
      return Promise.resolve(null)
    }

    try {
      const minter = new Minter($signer)

      tokenIds = ((await minter.tokensOfOwner($signerAddress)) as BigNumber[]).map((bn) =>
        parseInt(bn.toString(), 10),
      )
    } catch (err) {
      alert(`Error fetching: ${JSON.stringify(err, null, 2)}`)
    }
  }

  $: {
    if ($signer != null) {
      fetchNFTs()
    }
  }
</script>

<svelte:head>
  <title>My NFTs</title>
</svelte:head>

<section>
  <h1>{COLLECTION_NAME}</h1>

  <h2>balance: {balance}</h2>

  {#if $signerAddress == null}
    <Wallet />
    <p>Please, connect your wallet!</p>
  {/if}

  {#each nfts as nft (nft.tokenId)}
    <NFT {nft} />
  {/each}
</section>

<style>
  /* TODO: this could be part of the layout */
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
  }
</style>
