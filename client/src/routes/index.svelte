<script context="module" lang="ts">
  /** @type {import('@sveltejs/kit').Load} */
  export const load = async ({ fetch }) => {
    const res = await fetch('/api/nfts')

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
  // import type { ContractTransaction } from 'ethers'
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
  // let mintedTokenId: number
  let tokenId: INFT

  const refetchStats = async () => {
    try {
      const res = await load({ fetch })
      nftsCount = res.props.nftsCount
      maxSupply = res.props.maxSupply
    } catch (err) {
      alert(`Error during stats refetching: ${err}`)
    }
  }

  const handleMint = async () => {
    minting = true

    let tokenURI: string

    try {
      // This is a hash stored in IPFS.
      tokenURI = await api.getNextMintableToken()

      if (tokenURI == null) throw new Error('All NFTs have been minted')

      // Set hash status to 'MINTING' so that other users cannot mint the same token.
      await api.updateTokenData(tokenURI, 'MINTING')

      // Store token hash into the blockchain and transfer it to the connected account.
      const minter = new Minter($signer)
      const tokenId = await minter.mint(tokenURI)

      // In case minting process went fine, update hash status to 'MINTED'.
      await api.updateTokenData(tokenURI, 'MINTED', tokenId)

      await refetchStats() // TODO: move to api.
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

  {#if tokenId != null}
    {#key tokenId.tokenId}
      <NFT nft={tokenId} />
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
