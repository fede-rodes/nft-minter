<script lang="ts">
  import { blur } from 'svelte/transition'
  export let nft: { tokenId: number; tokenUri: string }

  $: tokenId = nft.tokenId
  $: tokenUri = nft.tokenUri
  $: imageUri = `${tokenId}.png`
</script>

<div in:blur={{ delay: 1000 }}>
  <img src={imageUri} height="100" width="100" alt="NFT" />
  <p>tokenId: {tokenId}</p>
  <p>tokenUri: {tokenUri}</p>
</div>
