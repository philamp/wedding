<script>

export let sectionsProp = [];
export let pageParam;
import Poi from '/src/components/Poi.svelte'
import { connectionStatus, formValuesRoot } from '/src/store.js';

let booking = false
let bookingHidden = true

$: if($connectionStatus){
    if($formValuesRoot.bookingsByFamilyId){
        booking = $formValuesRoot.bookingsByFamilyId.nodes.filter(arg => arg.bookingState == "accepted" || arg.bookingState == "pending").length > 0 ? true : false
        bookingHidden = !booking
    }

                
}

</script>



{#each sectionsProp as sectionItem}

<div class:hidden={sectionItem.sectionPageParam != pageParam && (sectionItem.sectionPageParam != "logement" || (pageParam == "avisiter" || pageParam == "liste-mariage" || pageParam == "program"))}>

<h2 class="my-4 mx-4 text-2xl font-bold text-primary">{sectionItem.sectionTitle}</h2>
{#each sectionItem.pois as poiItem, i}
{#if !(bookingHidden && poiItem.bookingProtected)}
<Poi poiProp={poiItem}/>
{/if}
{/each}

</div>


{/each}