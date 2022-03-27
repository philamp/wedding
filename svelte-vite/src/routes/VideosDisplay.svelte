<script>


import { onMount } from 'svelte';
import { connectionStatus } from '/src/store.js';
import Saos from "saos";

let htmlLoaded = false

const videoArray = [
"/videos_test/20170404-235507.webm",
"/videos_test/20170407-153850.webm",
"/videos_test/20170409-120128.webm",
"/videos_test/20170414-122156.webm",
"/videos_test/20170423-120853.webm",
"/videos_test/20170502-224248.webm",
"/videos_test/20170504-193501.webm",
"/videos_test/20170505-172119.webm",
"/videos_test/20170513-151554.webm",
"/videos_test/20170514-130338.webm",
"/videos_test/20170614-223040.webm",
"/videos_test/20170622-210814.webm",
"/videos_test/20170701-184658.webm",
"/videos_test/20170721-122334.webm",
"/videos_test/20170911-212257.webm",
"/videos_test/20171024-091224.webm",
"/videos_test/20171030-134154.webm",
"/videos_test/20171103-204957.webm",
"/videos_test/20171106-161301.webm",
"/videos_test/20171114-132104.webm",
"/videos_test/20171116-132233.webm",
"/videos_test/20171130-095810.webm",
"/videos_test/20171205-150711.webm",
"/videos_test/20171207-201656.webm",
"/videos_test/20180108-184921.webm",
"/videos_test/20180109-000207.webm",
"/videos_test/20180112-172534.webm",
"/videos_test/20180115-184154.webm",
"/videos_test/20180122-203026.webm",
"/videos_test/20180126-105022.webm",
"/videos_test/20180129-214801.webm",
"/videos_test/20180208-171006.webm",
"/videos_test/20180208-183936.webm",
"/videos_test/20180220-135246.webm",
]

</script>

<div class="matrix_container">
{#each videoArray as videoUrl}

<Saos animation={"from-left 1s cubic-bezier(0.35, 0.5, 0.65, 0.95) both"} css_observer={"width: 450px; display:block;"}>
    <div class="rounded bg-base-100 shadow-lg"> 

            <!-- svelte-ignore a11y-media-has-caption -->
            <video autoplay muted style="width:100%">
				<source src={videoUrl} type="video/webm">
			</video>

        </div>

  </Saos>
    
{/each}
</div>


<style global lang="postcss">

  
.matrix_container{
      display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    margin: 0 auto;
    overflow-x: visible;
}

@keyframes -global-from-left {
  0% {
      transform: translateX(-800px) rotate(-540deg);
      opacity: 0;
    }
    100% {
      transform: translateX(0) rotate(0deg);
      opacity: 1;
    }
}
</style>