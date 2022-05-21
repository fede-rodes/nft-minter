<script lang="ts">
  import { onMount } from 'svelte'
  import { connected, signer, signerAddress } from 'svelte-ethers-store'
  import type { NFT } from '$types/index'
  import { Minter } from '$contracts/minter'
  import { Wallet } from '$components/wallet'
  import { NFTImage } from '$components/nft-image'

  const COLLECTION_NAME = import.meta.env.VITE_COLLECTION_NAME

  let nfts: NFT[] = []

  const fetchNFTs = async (): Promise<void> => {
    if (!$connected) {
      nfts = []
      return
    }

    try {
      const minter = new Minter($signer)
      nfts = (await minter.tokensByAddress($signerAddress)).map((nft) => ({
        ...nft,
        tokenURI: nft.tokenURI.replace('ipfs://ipfs/', 'https://ipfs.io/ipfs/'),
      }))
    } catch (err) {
      alert(`Error fetching: ${JSON.stringify(err, null, 2)}`)
    }
  }

  onMount(fetchNFTs)
</script>

<svelte:head>
  <title>My NFTs</title>
</svelte:head>

<section class="flex flex-col justify-center items-center flex-1">
  <h1>{COLLECTION_NAME}</h1>

  <h2>Tokens minted: {nfts.length}</h2>

  {#if !$connected}
    <Wallet />
    <p>Please, connect your wallet!</p>
  {/if}

  {#each nfts as nft (nft.tokenId)}
    <NFTImage src={nft.tokenURI} id={nft.tokenId} />
    <p>{JSON.stringify(nft.tokenURI, null, 2)}</p>
  {/each}
</section>

