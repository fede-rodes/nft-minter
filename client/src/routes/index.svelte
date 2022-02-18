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
  import { signer, signerAddress } from 'svelte-ethers-store'
  import { MinterContract } from '$contracts/Minter'
  import { NFT } from '$components/nft'

  export let nfts: [{ tokenId: number; tokenURI: string }] | [] = []

  // TODO: this should come from the server in order to know what's the
  // next NFT to be minted, or try setting baseURI inside the smart contract
  // and forget about passing the tokenURI from the client.
  const NFTs = [
    {
      tokenId: 1,
      tokenURI: "ipfs://QmXhfZ3BcBdfwT7tPxxHScYG5ZzDbq36NUdjKFYm6wTEZJ/1.json"
    },
    {
      tokenId: 2,
      tokenURI: "ipfs://QmXhfZ3BcBdfwT7tPxxHScYG5ZzDbq36NUdjKFYm6wTEZJ/2.json"
    },
    {
      tokenId: 3,
      tokenURI: "ipfs://QmXhfZ3BcBdfwT7tPxxHScYG5ZzDbq36NUdjKFYm6wTEZJ/3.json"
    },
    {
      tokenId: 4,
      tokenURI: "ipfs://QmXhfZ3BcBdfwT7tPxxHScYG5ZzDbq36NUdjKFYm6wTEZJ/4.json"
    }
  ]

  const refetchNFTs = async () => {
    try {
      const res = await load({ fetch })
      nfts = res.props.nfts
    } catch (err) {
      alert(`Error during NFTs refetch: ${err}`)
    }
  }

  const handleMint = async () => {
    try {
      const minter = new MinterContract($signer)
      const nextNFT = NFTs.find(({ tokenId }) => tokenId === nfts.length + 1)
      if (nextNFT == null) alert('All NFTs have been minted')
      const tx = await minter.mintNFT(nextNFT.tokenURI, { gasLimit: 2000000 }) // TODO: set gasLimit
      tx.wait()
      await refetchNFTs()
    } catch (err) {
      alert(`Error during mint: ${JSON.stringify(err, null, 2)}`)
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

  {#each nfts.reverse() as nft (nft.tokenId)}
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
