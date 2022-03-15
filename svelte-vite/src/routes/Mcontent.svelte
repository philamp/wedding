
<script>


import DynMap from '/src/components/DynMap.svelte';
    import { storeReady, mapOpened} from '/src/store.js';

    
    import { sections } from '/src/poi.json';
    import UnfoldPoi from '/src/components/UnfoldPoi.svelte';
    
    	//spa router params
	export let params = {}

  let pageParam

  $: pageParam = params.category

  $: if(pageParam){
      if(document.querySelector('#central-content')){
      document.querySelector('#central-content').scrollTo(0, 0);
    }
  }

    </script>


<div id="mapDrawer" class="drawer drawer-end drawer-mobile">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" bind:checked={$mapOpened}> 
    <div class="drawer-content py-[4rem]">


      <div id="maps-central-content">
  
  <!--POI CONTENT BEGIN -->
      <UnfoldPoi sectionsProp={sections} {pageParam}/>
  <!--POI CONTENT END-->



</div><!--END CENTRAL CONTENT--> 

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