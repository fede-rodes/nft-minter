<script lang="ts">
  /**
   * @summary image src
   */
  export let src: string
  /**
   * @summary any kind of id
   */
  export let id: string | number
</script>

<div>
  <img {src} height="100" width="100" alt="NFT" />
  <p>{id}</p>
</div>
