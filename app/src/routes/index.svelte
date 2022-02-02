<script lang="ts">
  import { signer, provider } from 'svelte-ethers-store'
  import { MinterContract } from '$contracts/Minter'

  let promise: Promise<string>
  let newGreet = ''

  const getCount = async () => {
    const contract = MinterContract($signer, $provider)
    promise = contract.count()
  }

  // const handleSubmit = async () => {
  //   const contract = MinterContract($signer, $provider)
  //   const tx = await contract.setGreeting(newGreet, { gasLimit: 2000000 })
  //   tx.wait()
  // }

  $: {
    if ($provider != null) {
      getCount()
    }
  }
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<section>
  {#await promise}
    <p>Loading ...</p>
  {:then count}
    <p>Count: {count}</p>
  {/await}

  <!-- <form on:submit|preventDefault={handleSubmit}>
    <input type="text" bind:value={newGreet} />
    <button type="submit">Submit</button>
  </form> -->
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
