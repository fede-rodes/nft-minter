<script context="module" lang="ts">
  /** @type {import('@sveltejs/kit').Load} */
  export const load = async ({ fetch }) => {
    // TODO: can we move this logic inside api?
    const res = (await fetch('/api/get-contract-stats')) as Response

    if (res.ok) {
      const { nftsCount, maxSupply } = await res.json()

      return {
        props: {
          nftsCount,
          maxSupply,
        },
      }
    }

    return {
      status: 500,
      error: new Error(`Could not load ${JSON.stringify(await res.json())}`),
    }
  }
</script>

<script lang="ts">
  import { signer, signerAddress } from 'svelte-ethers-store'
  import type { INFT } from '$types/index'
  import { api } from '$api/index'
  import { Minter } from '$contracts/Minter'
  import { Wallet } from '$components/wallet'
  import { NFT } from '$components/nft'

  const COLLECTION_NAME = import.meta.env.VITE_COLLECTION_NAME

  export let nftsCount = 0
  export let maxSupply: number

  let minting = false
  let mintedNFT: INFT

  const refetchStats = async () => {
    try {
      // TODO: move to api.
      // TODO: test
      const res = await load({ fetch })
      if (res.error != null) throw res.error
      nftsCount = res.props.nftsCount
      maxSupply = res.props.maxSupply
    } catch (err) {
      alert(`Error during stats refetching: ${err}`)
    }
  }

  const handleMint = async () => {
    let tokenURI: string

    minting = true

    try {
      // Get a new hash from the DB. Each hash points to a JSON file
      // stored on IPFS which contains some metadata plus a reference
      // to the NFT image, also stored on IPFS.
      tokenURI = await api.getNextMintableToken()

      if (tokenURI == null) throw new Error('All NFTs have been minted')

      // Update DB to prevent users from grabbing the same hash.
      await api.updateTokenData(tokenURI, 'MINTING')

      // Store token hash into the blockchain and transfer it to the
      // connected account.
      const minter = new Minter($signer)
      const tokenId = await minter.mint(tokenURI)

      // Display NFT on UI.
      // TODO: use a store so that we can go back and forth bettwen the
      // mint and my-nfts page and still see the latest minted NFT
      mintedNFT = { tokenId, tokenURI }

      // In case the minting process went fine, update hash status to 'MINTED'.
      await api.updateTokenData(tokenURI, 'MINTED', tokenId)

      await refetchStats()
    } catch (err) {
      alert(`Error during mint: ${JSON.stringify(err, null, 2)}`)
    }

    minting = false
  }
</script>

<svelte:head>
  <title>Mint</title>
</svelte:head>

<section>
  <h1>{COLLECTION_NAME}</h1>

  <h2>
    {nftsCount}/{maxSupply}
    <br />
    {COLLECTION_NAME} minted
  </h2>

  {#if $signer == null || $signerAddress == null}
    <Wallet />
    <p>Please, connect your wallet!</p>
  {:else}
    <button type="button" disabled={minting} on:click={handleMint}>
      {minting ? 'Minting...' : 'Mint'}
    </button>
  {/if}

  {#if mintedNFT != null}
    {#key mintedNFT.tokenId}
      <NFT nft={mintedNFT} />
    {/key}
  {/if}
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
  }
</style>
