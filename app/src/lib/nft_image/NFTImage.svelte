<script lang="ts">
    import { signer, provider, signerAddress } from 'svelte-ethers-store'
  import { MinterContract } from '$contracts/Minter'

  export let tokenId: number
  console.log({ tokenId })
  let tokenURI = ''

  const getTokenURI = async () => {
    const contract = MinterContract($signer, $provider)
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
  <img src="{imageURI}" height="100" width="100" alt="NFT" />
  <p>tokenId: {tokenId}</p>
  <p>tokenURI: {tokenURI}</p>
</div>
