<script lang="ts">
  import { utils } from 'ethers'
  import { signer, provider, signerAddress } from 'svelte-ethers-store'
  import { MinterContract } from '$contracts/Minter'
import { NFTImage } from '$lib/nft_image'

  const CONTENT_ID = 'QmXhfZ3BcBdfwT7tPxxHScYG5ZzDbq36NUdjKFYm6wTEZJ'
  let count = 0

  const getCount = async () => {
    const contract = MinterContract($signer, $provider)
    count = parseInt((await contract.count()).toString(), 10)
  }

  const handleMint = async () => {
    const contract = MinterContract($signer, $provider)
    const _count = parseInt((await contract.count()).toString(), 10)
    // const metadataURI = `${CONTENT_ID}/${_count + 1}.json`
    // console.log({ metadataURI, signerAddress: $signerAddress })
    const tx = await contract.payToMint($signerAddress, { gasLimit: 2000000, value: utils.parseEther("0.05") })
    tx.wait()
  }

  $: {
    if ($provider != null) {
      getCount()
    }
  }
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<section>
  <h1>NFTs collection</h1>
    <p>Count: {count}</p>
    {#each [...Array(count+1).keys()].slice(1) as tokenId}
      <NFTImage {tokenId} />
    {/each}

    <button type="button" on:click="{handleMint}">
      Mint
    </button>
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
