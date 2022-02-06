<script lang="ts">
  import { provider, signer } from 'svelte-ethers-store'
  import { minterContract } from '$contracts/Minter'

  export let tokenId: number
  console.log({ tokenId })
  let tokenURI = ''

  const getTokenURI = async () => {
    const contract = minterContract($provider, $signer)
    tokenURI = await contract.tokenURI(tokenId)
  }

  $: {
    if ($provider != null) {
      getTokenURI()
    }
  }

  // const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.png`
  const imageURI = `${tokenId}.png`
</script>

<div>
  <img src={imageURI} height="100" width="100" alt="NFT" />
  <p>tokenId: {tokenId}</p>
  <p>tokenURI: {tokenURI}</p>
</div>
