<script lang="ts">
  import { onMount } from 'svelte'
  import { connected, provider, signer, signerAddress, defaultEvmStores } from 'svelte-ethers-store'
  import { RPC_URL } from '../../config'

  // We use two providers to interact with the Ethereum blockchain. The first one is
  // what it's called an `injected` web3 provider which, by default, is MetaMask.
  // The term `injected` means code or data that comes from a user's browser and is
  // available for the website to use.
  // The second one is what's called a `network` provider. Exmaples of these are Infura,
  // Etherscan, Alchemy, etc. By using a `network` provider we can perform calls to the
  // Ethereum blockchain (for instance getting some public variable's value) but we
  // cannot sign any transactions.

  const defaultProvider = 'Network'
  let selectedProvider: 'Injected' | 'Network' = defaultProvider
  const providers = {
    Injected: () => defaultEvmStores.setProvider(),
    Network: () => defaultEvmStores.setProvider(RPC_URL), // new ethers.providers.JsonRpcProvider(RPC_URL)
  }
  let pending = false

  const connect = async () => {
    pending = true
    try {
      await providers[selectedProvider]()
      console.log('$connected', defaultEvmStores.$connected)
      console.log('$provider', defaultEvmStores.$provider)
      console.log('$signer', defaultEvmStores.$signer)
    } catch (e) {
      console.log(e)
    }
    pending = false
  }

  // Disconnect from `injected` provider and re-connect to `network` provider
  const disconnect = async () => {
    await defaultEvmStores.disconnect()
    selectedProvider = defaultProvider
    connect()
    pending = false
  }

  $: network = $connected ? $provider.getNetwork() : ''
  $: account = $connected && $signer ? $signer.getAddress() : ''

  // Connect to default provider on mount
  onMount(connect)
</script>

<svelte:head>
  <title>About</title>
</svelte:head>

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

  {#if selectedProvider === 'Injected'}
    <button on:click={disconnect}>Disconnect</button>
  {:else}
    <button
      disabled={pending}
      on:click={() => {
        selectedProvider = 'Injected'
        connect()
      }}>Connect with Metamask</button
    >
  {/if}
{/if}
