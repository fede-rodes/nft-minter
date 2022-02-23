<script lang="ts">
  import { signer, signerAddress } from 'svelte-ethers-store'
  import type { INFT } from '$types/index'
  import { Minter } from '$contracts/Minter'
  import { Wallet } from '$components/wallet'
  import { NFT } from '$components/nft'

  const COLLECTION_NAME = import.meta.env.VITE_COLLECTION_NAME

  let nfts: INFT[] = []

  const fetchNFTs = async (): Promise<void> => {
    if ($signer == null || $signerAddress == null) {
      nfts = []
      return
    }

    try {
      const minter = new Minter($signer)
      nfts = await minter.tokensByAddress($signerAddress)
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

  <h2>Tokens minted: {nfts.length}</h2>

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
