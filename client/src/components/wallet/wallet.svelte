<script lang="ts">
  import { onMount } from 'svelte'
  import { connected, provider, signer, signerAddress, defaultEvmStores } from 'svelte-ethers-store'

  let pending = false

  // Connect to an `injected` web3 provider which, by default, is MetaMask.
  // The term `injected` means code or data that comes from a user's browser and is
  // available for the website to use.
  const connect = async () => {
    pending = true

    try {
      await defaultEvmStores.setProvider()
      console.log('$connected', $connected)
      console.log('$provider', $provider)
      console.log('$signer', $signer)
    } catch (err) {
      console.log(err)
    }

    pending = false
  }

  const disconnect = async () => {
    await defaultEvmStores.disconnect()
  }

  $: network = $connected ? $provider.getNetwork() : ''
  $: account = $connected && $signer ? $signer.getAddress() : ''

  // (Re)connect user to the `injected` provider on mount.
  onMount(connect)
</script>

{#if pending}connecting...{/if}

{#if $connected}
  <p>
    Well done, you are now connected to the blockchain (account {$signerAddress})

    {#await network}
      <span>waiting...</span>
    {:then value}
      <span>{JSON.stringify(value)}</span>
    {/await}

    {#await account}
      <span>waiting...</span>
    {:then value}
      with {#if value}account {value}{:else}no account{/if}
    {/await}
  </p>

  <button on:click={disconnect}>Disconnect</button>
{:else}
  <button disabled={pending} on:click={connect}>Connect with Metamask</button>
{/if}
