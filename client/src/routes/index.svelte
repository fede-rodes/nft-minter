<script context="module" lang="ts">
  /** @type {import('@sveltejs/kit').Load} */
  export const load = async ({ fetch }) => {
    const res = (await fetch('/api/get-contract-stats')) as Response
    const json = await res.json()

    if (res.ok) {
      return {
        props: json,
      }
    }

    return {
      status: 500,
      error: new Error(`Could not load ${JSON.stringify(json)}`),
    }
  }
</script>

<script lang="ts">
  import { ethers } from 'ethers'
  import { connected, signer } from 'svelte-ethers-store'
  import type { DBItem } from '$types/index'
  import { api } from '$api/index'
  import { Minter } from '$contracts/minter'
  import { mintedNFT } from '$stores/minted-nft'
  import { Wallet } from '$components/wallet'
  import { NFT } from '$components/nft'

  const COLLECTION_NAME = import.meta.env.VITE_COLLECTION_NAME

  export let nftsCount = 0
  export let maxSupply: number

  let minting = false

  const refetchStats = async () => {
    try {
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
    let item: DBItem

    minting = true

    try {
      // Get a new item (JSON file) from DB to be stored on IPFS.
      // The JSON file contains some metadata plus a reference
      // to the NFT image, also stored on IPFS.
      item = JSON.parse(await api.getItem()) as DBItem

      // Update DB to prevent users from grabbing the same hash.
      await api.updateItem(item.id, 'MINTING')

      console.log({ item })
      // Store token hash into the blockchain and transfer it to the
      // connected account.
      const minter = new Minter($signer)
      // TODO: upload item to ipfs and get hash back
      const tokenId = await minter.mint(item.image)

      // Display NFT on UI.
      mintedNFT.set({ ...item, tokenId })

      // In case the minting process went fine, update hash status to 'MINTED'.
      await api.updateItem(item.id, 'MINTED', tokenId)

      await refetchStats()
    } catch (err) {
      alert(`Error during mint: ${JSON.stringify(err, null, 2)}`)
    }

    minting = false
  }

  //   const ipfsAPI = require("ipfs-http-client");
  // const ipfs = ipfsAPI({ host: "ipfs.infura.io", port: "5001", protocol: "https" });
  // const mintItem = async () => {
  //   // upload to ipfs
  //   const uploaded = await ipfs.add(JSON.stringify(json[count]));
  //   setCount(count + 1);
  //   console.log("Uploaded Hash: ", uploaded);
  //   const result = tx(
  //     writeContracts &&
  //       writeContracts.YourCollectible &&
  //       writeContracts.YourCollectible.mintItem(address, uploaded.path),
  //     update => {
  //       console.log("📡 Transaction Update:", update);
  //       if (update && (update.status === "confirmed" || update.status === 1)) {
  //         console.log(" 🍾 Transaction " + update.hash + " finished!");
  //         console.log(
  //           " ⛽️ " +
  //             update.gasUsed +
  //             "/" +
  //             (update.gasLimit || update.gas) +
  //             " @ " +
  //             parseFloat(update.gasPrice) / 1000000000 +
  //             " gwei",
  //         );
  //       }
  //     },
  //   );
  // };
</script>

<svelte:head>
  <title>Mint</title>
</svelte:head>

<section>
  <h1 class="text-3xl font-bold underline">
    {COLLECTION_NAME}
  </h1>

  <h2>
    {nftsCount}/{maxSupply}
    <br />
    {COLLECTION_NAME} minted
  </h2>

  <Wallet />

  {#if !$connected}
    <p>Please, connect your wallet!</p>
  {:else}
    <button type="button" disabled={minting} on:click={handleMint}>
      {minting ? 'Minting...' : 'Mint'}
    </button>
  {/if}

  {#if $mintedNFT != null}
    {#key $mintedNFT.tokenId}
      <NFT nft={$mintedNFT} />
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
