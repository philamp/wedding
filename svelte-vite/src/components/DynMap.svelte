<script>
   import { onMount } from 'svelte';

    export let sections;

    //flatten sections to get only pois
    let cardsArray = []
    sections.forEach((section) => {
      section.pois.forEach((item) => {
      cardsArray[cardsArray.length] = item
      });
    });

    

    let container;
   let zoom = 12;
   let center = {lat: 49.09136629680224, lng: 0.5988271661269582 };

   onMount(async () => {
       const map = new google.maps.Map(container, {
           zoom,
           center,
           gestureHandling: "greedy"
           
       });


       const infoWindow = new google.maps.InfoWindow();

       cardsArray.forEach((card, i) => {

        card.bottomLinks.forEach((bottomLink,j) => {

          console.log(bottomLink);

          if(bottomLink.lat){

            let marker = new google.maps.Marker({
            position: { lat: bottomLink.lat, lng: bottomLink.lng },
            map,
            title: card.title,
            label: bottomLink.markerIcon
            });

            const fillWindow = () => {
                infoWindow.close();
                infoWindow.setContent(`${card.title}<br/><a href="https://www.google.com/maps/dir/?api=1&destination=${bottomLink.lat},${bottomLink.lng}" class="btn btn-secondary btn-xs" title="" target="_blank">Directions</a>`);
                infoWindow.open(map, marker);

            }

            marker.addListener("click", fillWindow);

            // dont put the event on bottomlink if not present
              if(document.getElementById("M-"+bottomLink.markerId)){
                document.getElementById("M-"+bottomLink.markerId).onclick = fillWindow
              }

            }
  
        });

      });
         
        

	       
   });

</script>

<div style="width: 100%; height: 100%" bind:this={container}></div>