<script>
    import { onDestroy } from 'svelte'
    import { alert, alertFailure } from './store.js'
    import { fly } from 'svelte/transition'
  
    export let ms = 3000
    let visible
    let timeout
  
    const onMessageChange = (message, ms) => {
      clearTimeout(timeout)
      if (!message) {               // hide Alert if message is empty
        visible = false
      } else {
        visible = true                                              // show alert
        if (ms > 0) timeout = setTimeout(() => {visible = false; $alert = ""; $alertFailure="false"}, ms) // and hide it after ms milliseconds
      }
    }
    $: onMessageChange($alert, ms)      // whenever the alert store or the ms props changes run onMessageChange
    
    onDestroy(()=> clearTimeout(timeout))           // make sure we clean-up the timeout
  
  </script>
  
  {#if visible}
  <div class="alert alert-success alert-sm floatingalert shadow-md" role="alert" class:failure={$alertFailure == "true"} on:click={() => visible = false} transition:fly="{{delay: 250, duration: 300, x: 0, y: -100}}">
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span>{ $alert }</span>
    </div>
  </div>
  {/if}
  
  <style>
  .floatingalert {
    position: fixed;
    cursor: pointer;
    right: 10px;
    top:10px;
    z-index: 10000;
    background-color: rgb(174, 236, 202);
  }

  .failure{
    background-color: rgb(230, 67, 26);
    color: #fff;
  }

  </style>