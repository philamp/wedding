<script>
  	import Summup from '/src/components/Summup.svelte';
export let poiProp;
// export let hidden;

let formValues = null; //we dont have them here

</script>

<div class="max-w-4xl bg-white rounded-xl shadow-md overflow-hidden mx-4 my-4">
    <div class="{poiProp.type == "shortCard" ? "xl:flex" : ""}">
      <div class="{poiProp.type == "shortCard" ? "xl:w-5/12 " : ""} md:shrink-0">
        <img class="object-cover h-64 w-full" src="{poiProp.imgSrc}" alt="">
      </div>
      <div class="p-4">
        <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{poiProp.overTitle}</div>
        <h3 class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">{poiProp.title}</h3>
        <p class="mt-2 text-slate-500">{poiProp.desc}</p>
        {#each poiProp.bottomLinks as bottomLink,j}
        {#if bottomLink.href}
        <a href="{bottomLink.href}" class="cursor-pointer btn btn-secondary btn-xs" target="_blank">{bottomLink.markerIcon} {bottomLink.label}</a>

        {:else}
        <label for="my-drawer-2" id="M-{bottomLink.mapMarkerId}" class="cursor-pointer btn btn-secondary btn-xs">{bottomLink.markerIcon} {#if !bottomLink.label}Afficher sur la carte{:else}{bottomLink.label}{/if}</label>
        {/if}
        {/each}

        {#if poiProp.title2}

        <Summup bind:formValues={formValues} />

        <div class="alert alert-success alert-sm shadow-md failure text-sm" role="alert">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span><strong>Avant de partir, merci de : </strong>
              <ul>
                <li>
                  - Vider les chambres de toute affaire personnelle
                </li>
                <li>
                  - Descendre les poubelles de salle de bain dans la cuisine du château
                </li>
                <li>
                  - Déposer les draps et serviettes au pied du lit
                </li>

              </ul>
            </span>
          </div>
          </div>
        {/if}




      </div>
    </div>
</div>