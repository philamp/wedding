
<script>


import DynMap from '/src/components/DynMap.svelte';
    import { storeReady } from '/src/store.js';

    
    import { sections } from '/src/poi.json';
    import UnfoldPoi from '/src/components/UnfoldPoi.svelte';
    
    	//spa router params
	export let params = {}

  let pageParam

  $: pageParam = params.category

    </script>


<div id="mapDrawer" class="drawer drawer-end drawer-mobile">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle"> 
    <div class="drawer-content py-[4rem]">
  
  <!--CONTENT BEGIN -->
      <UnfoldPoi sectionsProp={sections} {pageParam}/>
  <!--CONTENT END-->
      

    </div> 
    <div class="drawer-side">
      <label for="my-drawer-2" class="drawer-overlay"></label> 
      <div class="menu overflow-y-auto w-10/12 bg-base-100 text-base-content md:w-10/12 lg:w-[22rem] xl:w-[25rem] 2xl:w-[45rem]">
        {#if $storeReady}
        
<DynMap {sections}/>

        {/if}
      </div>
    </div>
  </div>
  <style global lang="postcss">
  
      #mapDrawer{
  margin-top: -65px;
  
    }
  
    </style>