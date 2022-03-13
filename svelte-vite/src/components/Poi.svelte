<script>

export let poiProp;

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
        <label for="my-drawer-2" id="M-{bottomLink.markerId}" class="cursor-pointer btn btn-secondary btn-xs">{bottomLink.markerIcon} Afficher sur la carte</label>
        {/if}
        {/each}


      </div>
    </div>
</div>