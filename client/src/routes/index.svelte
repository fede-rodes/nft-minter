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
  import type { ContractTransaction } from 'ethers'
  import { signer, signerAddress } from 'svelte-ethers-store'
  import type { INFT } from '$types/index'
  import { Minter } from '$contracts/Minter'
  import { Wallet } from '$components/wallet'
  import { NFT } from '$components/nft'

  const COLLECTION_NAME = import.meta.env.VITE_COLLECTION_NAME

  export let nftsCount = 0
  export let maxSupply: number

  let minting = false
  let mintedTokenId: number
  let mintedNFT: INFT

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
    try {
      minting = true

      const minter = new Minter($signer)

      const res = await fetch('/api/get-next-mintable-token')
      const nextNFT = (await res.json()).nft as INFT

      if (nextNFT == null) {
        alert('All NFTs have been minted')
        minting = false
        return
      }

      await fetch('/api/update-token-data', {
        method: 'POST',
        body: JSON.stringify({
          tokenURI: nextNFT.tokenURI,
          status: 'MINTING',
        }),
        headers: { 'content-type': 'application/json' },
      })

      const tx = (await minter.mintNFT(nextNFT.tokenURI, {
        gasLimit: 2000000, // TODO: set gasLimit
      })) as ContractTransaction

      const txReceipt = await tx.wait()

      // Get minted NFT to be display on the UI.
      const event = txReceipt?.events ? txReceipt.events[0] : null
      const value = event?.args ? event.args[2] : null

      mintedTokenId = value.toNumber()

      mintedNFT = {
        tokenId: mintedTokenId,
        tokenURI: nextNFT.tokenURI,
      }

      await fetch('/api/update-token-data', {
        method: 'POST',
        body: JSON.stringify({
          tokenURI: nextNFT.tokenURI,
          status: 'MINTED',
          tokenId: mintedTokenId,
        }),
        headers: { 'content-type': 'application/json' },
      })

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

  <button type="button" disabled={$signer == null || minting} on:click={handleMint}
    >{minting ? 'Minting...' : 'Mint'}</button
  >

  {#if $signerAddress == null}
    <Wallet />
    <p>Please, connect your wallet!</p>
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
