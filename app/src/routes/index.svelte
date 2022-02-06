<script context="module" lang="ts">
  /** @type {import('@sveltejs/kit').Load} */
  export async function load({ fetch }) {
    const res = await fetch('/api/nfts')

    if (res.ok) {
      const { nftsCount } = await res.json()

      return {
        props: {
          nftsCount,
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
  import { utils } from 'ethers'
  import { signer, provider, signerAddress } from 'svelte-ethers-store'
  import { minterContract } from '$contracts/Minter'
  import { NFTImage } from '$lib/nft_image'

  export let nftsCount = 0

  async function refetchNFTs() {
    try {
      const res = await load({ fetch })
      nftsCount = res.props.nftsCount
    } catch (err) {
      console.log(`Error during NFTs refetch: ${err}`)
    }
  }

  async function handleMint() {
    try {
      const contract = minterContract($provider, $signer)
      const tx = await contract.payToMint($signerAddress, {
        gasLimit: 2000000,
        value: utils.parseEther('0.05'),
      })
      tx.wait()
      await refetchNFTs()
    } catch (err) {
      console.log(`Error during mint: ${JSON.stringify(err, null, 2)}`)
    }
  }
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<section>
  <h1>NFTs collection</h1>

  <p>Count: {nftsCount}</p>

  <button type="button" on:click={handleMint}>Mint</button>

  {#each [...Array(nftsCount + 1).keys()].slice(1).reverse() as tokenId}
    <NFTImage {tokenId} />
  {/each}
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
