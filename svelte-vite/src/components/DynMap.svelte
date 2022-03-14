<script>
   import { onMount } from 'svelte';

    export let sections;

    //flatten sections to get only pois
    let cardsArray = []
    sections.forEach((section) => {
      section.pois.forEach((item) => {
      item.section = section.sectionPageParam
      cardsArray[cardsArray.length] = item
      });
    });

    

    let container;
   let zoom = 11;
   let center = {lat: 49.14461090622175, lng: 0.6586278227095459 };

   onMount(async () => {
       const map = new google.maps.Map(container, {
           zoom,
           center,
           gestureHandling: "greedy"
           
       });


       const infoWindow = new google.maps.InfoWindow();

       cardsArray.forEach((card, i) => {

        card.bottomLinks.forEach((bottomLink,j) => {

          if(bottomLink.lat){

            let marker = new google.maps.Marker({
            position: { lat: bottomLink.lat, lng: bottomLink.lng },
            map,
            title: card.title,
            zIndex: (card.section == "program" ? 1000 : (card.section == "hotels" ? 100 : 10)),
            label: null,
            icon: (card.section == "hotels" ? "/icons/hotel_0star.png" : (
              card.section == "avisiter" ? "/icons/castle-2.png" : (
                bottomLink.markerId == "eglise" ? "/icons/church-2.png" : "/icons/carsix.png"
              )

            )
            )

            });

            const fillWindow = () => {
                infoWindow.close();
                infoWindow.setContent(`${card.title}<br/><a href="https://www.google.com/maps/dir/?api=1&destination=${bottomLink.lat},${bottomLink.lng}" class="btn btn-secondary btn-xs" title="" target="_blank">Itinéraire dans maps</a>`);
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