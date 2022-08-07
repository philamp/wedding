
<script>


import DynMap from '/src/components/DynMap.svelte';
    import { storeReady, mapOpened} from '/src/store.js';
  
    
    import { sections } from '/src/poi.json';
    import UnfoldPoi from '/src/components/UnfoldPoi.svelte';
    import { onMount } from 'svelte';
    import { alert, connectionStatus, formValuesRoot, connectionAttempted } from '/src/store.js'
    
    	//spa router params
	export let params = {}

  let htmlLoaded = false;

  let formValues = $formValuesRoot

  onMount(() => {

    htmlLoaded = true;
  })

  let copiedSections = JSON.parse(JSON.stringify(sections)); 

  let pageParam

  let itemParam

  const showChange = (pP) => {
    $alert = "Changement de page : " + sections[sections.findIndex(arg => arg.sectionPageParam == pageParam)].sectionTitle
  }



  $: pageParam = params.category

  $: itemParam = params.item

  $: if(htmlLoaded && itemParam){
    setTimeout(() => {document.querySelector('#M-'+itemParam).scrollIntoView();
    document.querySelector('#map-content-drawer').scrollBy(0,-200);}, 100)
  }

  $: showChange(pageParam)


  $: if($connectionStatus && $connectionAttempted && $formValuesRoot.bookingsByFamilyId && $formValuesRoot.bookingsByFamilyId.nodes.filter(arg => arg.bookingState == "accepted" || arg.bookingState == "pending").length > 0){

    copiedSections.unshift({
	sectionTitle : "Logement sur le domaine du Château",
	sectionPageParam : "logements",
		pois : [
			{
				type: "longCard",
				imgSrc: "/static_pictures/logementpic.jpg",
				overTitle: "C'est super cosy",
				title: "Localiser la(les) chambre(s)",
				redNotice: "Vider les chambres de toute affaire personnelle; descendre les poubelles de salle de bain dans la cuisine du château; Déposer les draps et serviettes au pied du lit",
				desc: "Afficher la localisation de chaque chambre sur la carte :",
				bottomLinks: [],
				title2: true
    	},
		]
	})


  $formValuesRoot.bookingsByFamilyId.nodes.forEach((bknode) => {

    copiedSections[0].pois[0].bottomLinks[copiedSections[0].pois[0].bottomLinks.length] = {
					mapMarkerId: "rmid-"+bknode.roomId,
					label: bknode.roomByRoomId.buildingName+" / Étage "+bknode.roomByRoomId.etage+" / Chambre "+bknode.roomByRoomId.roomNumber,
					href: null,
					lat: bknode.roomByRoomId.geoloc != null ? bknode.roomByRoomId.geoloc.x : 49.14143080014507, 
					lng: bknode.roomByRoomId.geoloc != null ? bknode.roomByRoomId.geoloc.y : 0.6677124803025075,
					markerIcon: "🏠"
					}

  }

)
			
}

    </script>


<div id="mapDrawer" class="drawer drawer-end drawer-mobile">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" bind:checked={$mapOpened}> 
    <div id="map-content-drawer" class="drawer-content py-[4rem]">

  
  <!--POI CONTENT BEGIN -->
      <UnfoldPoi sectionsProp={copiedSections} {pageParam}/>
  <!--POI CONTENT END-->




    </div> 
    <div class="drawer-side">
      <label for="my-drawer-2" class="drawer-overlay"></label> 
      <div class="menu overflow-y-auto w-10/12 bg-base-100 text-base-content md:w-10/12 lg:w-[22rem] xl:w-[25rem] 2xl:w-[45rem]">
        {#if $storeReady && $connectionAttempted}
        
<DynMap sections={copiedSections}/>

        {/if}
      </div>
    </div>
  </div>
  <style global lang="postcss">
  
      #mapDrawer{
  margin-top: -65px;
  
    }
  
    </style>