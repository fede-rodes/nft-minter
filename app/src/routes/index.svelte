<script lang="ts">
  import { signer, provider } from 'svelte-ethers-store'
  import { GreeterContract } from '$contracts/Greeter'

  let promise: Promise<string>
  let newGreet = ''

  const getGreet = async () => {
    const contract = GreeterContract($signer, $provider)
    promise = contract.greet()
  }

  const handleSubmit = async () => {
    const contract = GreeterContract($signer, $provider)
    const tx = await contract.setGreeting(newGreet, { gasLimit: 2000000 })
    tx.wait()
  }

  $: {
    if ($provider != null) {
      getGreet()
    }
  }
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<section>
  {#await promise}
    <p>Loading ...</p>
  {:then greet}
    <p>Greet: {greet}</p>
  {/await}

  <form on:submit|preventDefault={handleSubmit}>
    <input type="text" bind:value={newGreet} />
    <button type="submit">Submit</button>
  </form>
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
