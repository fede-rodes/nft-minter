<script context="module" lang="ts">
  /** @type {import('@sveltejs/kit').Load} */
  export const load = async ({ fetch }) => {
    const res = await fetch('/api/nfts')

    if (res.ok) {
      const { nfts, maxSupply } = await res.json()

      return {
        props: {
          nfts,
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
  import { signer } from 'svelte-ethers-store'
  import { MinterContract } from '$contracts/Minter'
  import { InjectedProvider } from '$components/injected-provider'
  import { NFT } from '$components/nft'

  const COLLECTION_NAME = import.meta.env.VITE_COLLECTION_NAME

  interface INFT {
    tokenId: number
    tokenURI: string
  }

  export let nfts: INFT[] | [] = []
  export let maxSupply: number

  // TODO: this should come from the server in order to know what's the
  // next NFT to be minted. Other apporach could be trying to set baseURI
  // inside the Minter smart contract and forget about passing the
  // tokenURI from the client.
  const NFTs: INFT[] = [
    {
      tokenId: 1,
      tokenURI: 'ipfs://QmXhfZ3BcBdfwT7tPxxHScYG5ZzDbq36NUdjKFYm6wTEZJ/1.json',
    },
    {
      tokenId: 2,
      tokenURI: 'ipfs://QmXhfZ3BcBdfwT7tPxxHScYG5ZzDbq36NUdjKFYm6wTEZJ/2.json',
    },
    {
      tokenId: 3,
      tokenURI: 'ipfs://QmXhfZ3BcBdfwT7tPxxHScYG5ZzDbq36NUdjKFYm6wTEZJ/3.json',
    },
    {
      tokenId: 4,
      tokenURI: 'ipfs://QmXhfZ3BcBdfwT7tPxxHScYG5ZzDbq36NUdjKFYm6wTEZJ/4.json',
    },
  ]

  let minting = false
  let mintedTokenId: number
  $: mintedNFT = NFTs.find(({ tokenId }) => tokenId === mintedTokenId)

  const refetchNFTs = async () => {
    try {
      const res = await load({ fetch })
      nfts = res.props.nfts
    } catch (err) {
      alert(`Error during NFTs refetching: ${err}`)
    }
  }

  const handleMint = async () => {
    try {
      minting = true

      const minter = new MinterContract($signer)
      // Get next NFT to be minted based on the latest minted index.
      const nextNFT = NFTs.find(({ tokenId }) => tokenId === nfts.length + 1)

      if (nextNFT == null) {
        alert('All NFTs have been minted')
        minting = false
        return
      }

      const tx = (await minter.mintNFT(nextNFT.tokenURI, {
        gasLimit: 2000000, // TODO: set gasLimit
      })) as ContractTransaction
      const txReceipt = await tx.wait()

      // Get latest minted NFT to be display on the UI.
      const event = txReceipt?.events ? txReceipt.events[0] : null
      const value = event?.args ? event.args[2] : null
      mintedTokenId = value.toNumber()

      await refetchNFTs()
    } catch (err) {
      alert(`Error during mint: ${JSON.stringify(err, null, 2)}`)
    }

    minting = false
  }
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<section>
  <h1>{COLLECTION_NAME}</h1>

  <h2>
    {nfts.length}/{maxSupply}
    <br />
    {COLLECTION_NAME} minted
  </h2>

  <button type="button" disabled={$signer == null || minting} on:click={handleMint}
    >{minting ? 'Minting...' : 'Mint'}</button
  >

  {#if $signer == null}
    <InjectedProvider />
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
