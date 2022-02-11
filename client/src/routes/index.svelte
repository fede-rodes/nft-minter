<script context="module" lang="ts">
  /** @type {import('@sveltejs/kit').Load} */
  export const load = async ({ fetch }) => {
    const res = await fetch('/api/nfts')

    if (res.ok) {
      const { nfts } = await res.json()

      return {
        props: {
          nfts,
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
  import { signer, signerAddress } from 'svelte-ethers-store'
  import { MinterContract } from '$contracts/Minter'
  import { NFT } from '$components/nft'

  export let nfts: [{ tokenId: number; tokenUri: string }] | [] = []

  const refetchNFTs = async () => {
    try {
      const res = await load({ fetch })
      nfts = res.props.nfts
    } catch (err) {
      console.log(`Error during NFTs refetch: ${err}`)
    }
  }

  const handleMint = async () => {
    try {
      const minter = new MinterContract($signer)
      const tx = await minter.payToMint($signerAddress, {
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

  <p>Count: {nfts.length}</p>

  {#if $signer != null}
    <button type="button" on:click={handleMint}>Mint</button>
  {/if}

  {#each nfts.reverse() as nft}
    <NFT {nft} />
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
