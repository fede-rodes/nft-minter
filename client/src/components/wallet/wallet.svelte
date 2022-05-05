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

<!-- let networkDisplay = "";
  if (NETWORKCHECK && localChainId && selectedChainId && localChainId !== selectedChainId) {
    const networkSelected = NETWORK(selectedChainId);
    const networkLocal = NETWORK(localChainId);
    if (selectedChainId === 1337 && localChainId === 31337) {
      networkDisplay = (
        <div style={{ zIndex: 2, position: "absolute", right: 0, top: 60, padding: 16 }}>
          <Alert
            message="⚠️ Wrong Network ID"
            description={
              <div>
                You have <b>chain id 1337</b> for localhost and you need to change it to <b>31337</b> to work with
                HardHat.
                <div>(MetaMask -&gt; Settings -&gt; Networks -&gt; Chain ID -&gt; 31337)</div>
              </div>
            }
            type="error"
            closable={false}
          />
        </div>
      );
    } else {
      networkDisplay = (
        <div style={{ zIndex: 2, position: "absolute", right: 0, top: 60, padding: 16 }}>
          <Alert
            message="⚠️ Wrong Network"
            description={
              <div>
                You have <b>{networkSelected && networkSelected.name}</b> selected and you need to be on{" "}
                <Button
                  onClick={async () => {
                    const ethereum = window.ethereum;
                    const data = [
                      {
                        chainId: "0x" + targetNetwork.chainId.toString(16),
                        chainName: targetNetwork.name,
                        nativeCurrency: targetNetwork.nativeCurrency,
                        rpcUrls: [targetNetwork.rpcUrl],
                        blockExplorerUrls: [targetNetwork.blockExplorer],
                      },
                    ];
                    console.log("data", data);

                    let switchTx;
                    // https://docs.metamask.io/guide/rpc-api.html#other-rpc-methods
                    try {
                      switchTx = await ethereum.request({
                        method: "wallet_switchEthereumChain",
                        params: [{ chainId: data[0].chainId }],
                      });
                    } catch (switchError) {
                      // not checking specific error code, because maybe we're not using MetaMask
                      try {
                        switchTx = await ethereum.request({
                          method: "wallet_addEthereumChain",
                          params: data,
                        });
                      } catch (addError) {
                        // handle "add" error
                      }
                    }

                    if (switchTx) {
                      console.log(switchTx);
                    }
                  }}
                >
                  <b>{networkLocal && networkLocal.name}</b>
                </Button>
              </div>
            }
            type="error"
            closable={false}
          />
        </div>
      );
    }
  } else {
    networkDisplay = (
      <div style={{ zIndex: -1, position: "absolute", right: 154, top: 28, padding: 16, color: targetNetwork.color }}>
        {targetNetwork.name}
      </div>
    );
  } -->
