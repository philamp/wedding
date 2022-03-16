
<script>


import DynMap from '/src/components/DynMap.svelte';
    import { storeReady, mapOpened} from '/src/store.js';

    
    import { sections } from '/src/poi.json';
    import UnfoldPoi from '/src/components/UnfoldPoi.svelte';
    import { onMount } from 'svelte';
    import { alert } from '/src/store.js'
    
    	//spa router params
	export let params = {}

  let htmlLoaded = false;

  onMount(() => {

    htmlLoaded = true;
  })


  let pageParam

  let itemParam

  const showChange = (pP) => {
    $alert = "Changement de page : " + sections[sections.findIndex(arg => arg.sectionPageParam == pageParam)].sectionTitle
  }

  $: pageParam = params.category

  $: itemParam = params.item

  $: if(htmlLoaded && itemParam){
    setTimeout(() => {document.querySelector('#C-'+itemParam).scrollIntoView();
    document.querySelector('#map-content-drawer').scrollBy(0,-50);}, 100)
  }

  $: showChange(pageParam)

    </script>


<div id="mapDrawer" class="drawer drawer-end drawer-mobile">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" bind:checked={$mapOpened}> 
    <div id="map-content-drawer" class="drawer-content py-[4rem]">

  
  <!--POI CONTENT BEGIN -->
      <UnfoldPoi sectionsProp={sections} {pageParam}/>
  <!--POI CONTENT END-->




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