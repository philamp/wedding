
<script>
import Map from './Map.svelte';
import { storeReady } from './../store.js';



</script>

<div id="mapDrawer" class="rounded-lg shadow drawer drawer-end drawer-mobile">
  <input id="my-drawer-2" type="checkbox" class="drawer-toggle"> 
  <div class="drawer-content py-[4rem]">
    
    

    
    <h2 class="my-4 mx-4 text-2xl font-bold text-primary">Programme</h2>

    <div class="max-w-4xl bg-white rounded-xl shadow-md overflow-hidden mx-4 my-4">
      <div class="xl:flex">
        <div class="xl:w-5/12 md:shrink-0">
          <img class="object-cover h-64 w-full" src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/%C3%89glise_Sainte-Croix_de_Bernay.jpg/1024px-%C3%89glise_Sainte-Croix_de_Bernay.jpg" alt="">
        </div>
        <div class="p-4">
          <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Cérémonie de mariage: 14h20</div>
          <a href="#" class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">Eglise Sainte-Croix de Bernay</a>
          <p class="mt-2 text-slate-500">La messe sera célébrée en l’église Sainte-Croix de Bernay par le père Nicolas Lebas.</p>
          <label for="my-drawer-2" id="egliseSainteCroixM" class="cursor-pointer btn btn-secondary btn-xs">⛪ Afficher sur la carte</label>
        </div>
      </div>
    </div>

    <div class="max-w-4xl bg-white rounded-xl shadow-md overflow-hidden mx-4 my-4">
      <div class="xl:flex">
        <div class="xl:w-5/12 md:shrink-0">
          <img class="object-cover h-64 w-full" src="https://www.1001salles.com/images/provider/9626/1507731735_6403_700920710.jpg" alt="">
        </div>
        <div class="p-4">
          <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Cocktail: 16h</div>
          <a href="#" class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">Chateau de Carsix</a>
          <p class="mt-2 text-slate-500">Réception dans le chateau de Carsix</p>
          <label for="my-drawer-2" id="ChateauM" class="cursor-pointer btn btn-secondary btn-xs">🏰 Afficher sur la carte</label>
        </div>
      </div>
    </div>
  
  

  </div> 
  <div class="drawer-side">
    <label for="my-drawer-2" class="drawer-overlay"></label> 
    <div class="menu overflow-y-auto w-10/12 bg-base-100 text-base-content md:w-10/12 lg:w-[22rem] xl:w-[25rem] 2xl:w-[45rem]">
      {#if $storeReady}
      <Map></Map>
      {/if}
    </div>
  </div>
</div>
<style global lang="postcss">

	#mapDrawer{
margin-top: -65px;

  }

  </style>

