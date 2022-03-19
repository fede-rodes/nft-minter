<script lang="ts">
  import type { INFT } from '$types/index'

  export let nft: INFT

  $: tokenId = nft.tokenId
  $: tokenURI = nft.tokenURI
  $: imageUri = `${tokenId}.png`
</script>

<div>
  <img src={imageUri} height="100" width="100" alt="NFT" />
  <p>tokenId: {tokenId}</p>
  <p>tokenURI: {tokenURI}</p>
</div>
