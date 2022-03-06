<script>

   let container;
   let map;
   let zoom = 12;
   let center = {lat: 49.09136629680224, lng: 0.5988271661269582 };
   
   import { onMount } from 'svelte';


   
   onMount(async () => {
       const map = new google.maps.Map(container, {
           zoom,
           center,
           gestureHandling: "greedy"
           
       });
       
       const infoWindow = new google.maps.InfoWindow();

       const ChateauM = new google.maps.Marker({
    position: { lat: 49.14143080014507, lng: 0.6677124803025075}, // 49.14143080014507, 0.6677124803025075
    map,
    title: "Le chateau",
    label: "🏰",
  });

  const egliseSainteCroixM = new google.maps.Marker({
    position: { lat: 49.09136629680224, lng: 0.5988271661269582 },
    map,
    title: "egliseSainteCroix",
    label: "⛪",
  });

  function egliseSainteCroixFocus() {
      infoWindow.close();
      infoWindow.setContent(`coucou eglise`);
      infoWindow.open(map, egliseSainteCroixM);
  }

  function ChateauFocus() {
      infoWindow.close();
      infoWindow.setContent(`coucou chateau`);
      infoWindow.open(map, ChateauM);
  }

  // add listener on marker
  egliseSainteCroixM.addListener("click", egliseSainteCroixFocus);
  //add listener on a labels in page
  document.getElementById("egliseSainteCroixM").onclick = egliseSainteCroixFocus;

    // add listener on marker
    ChateauM.addListener("click", ChateauFocus);
  //add listener on a labels in page
  document.getElementById("ChateauM").onclick = ChateauFocus;

	       
   });


</script>

<div style="width: 100%; height: 100%" bind:this={container}></div>