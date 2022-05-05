<script lang="ts">
  import type { DBItem } from '$types/index'

  export let nft: DBItem

  // $: tokenId = nft.tokenId
  // $: tokenURI = nft.tokenURI
  // $: imageUri = `${tokenId}.png`
</script>

<div>
  <img src={nft.image} height="100" width="100" alt="NFT" />
  <p>tokenId: {nft.tokenId}</p>
  <!-- <p>tokenURI: {nft.tokenURI}</p> -->
</div>
