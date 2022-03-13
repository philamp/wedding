<script>

export let sectionsProp = [];
export let pageParam;
import Poi from '/src/components/Poi.svelte'

</script>

{#each sectionsProp as sectionItem}

{#if sectionItem.sectionPageParam == pageParam}
<h2 class="my-4 mx-4 text-2xl font-bold text-primary">{sectionItem.sectionTitle}</h2>
{#each sectionItem.pois as poiItem, i}
<Poi poiProp={poiItem}/>
{/each}
{/if}

{/each}