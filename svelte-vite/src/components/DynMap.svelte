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

            var marker = new google.maps.Marker({
            position: { lat: bottomLink.lat, lng: bottomLink.lng },
            map,
            title: card.title,
            label: bottomLink.markerIcon
            });

            marker.addListener("click", () => 
              {
                  infoWindow.close();
                infoWindow.setContent(card.title);
                infoWindow.open(map, marker);

            });

            // dont put the event on bottomlink if not present
              if(document.getElementById("M-"+bottomLink.markerId)){
                document.getElementById("M-"+bottomLink.markerId).onclick = () => 
                {

                    infoWindow.close();
                  infoWindow.setContent(card.title);
                  infoWindow.open(map, marker);

                }
              }

            }
  
        });

      });
         
        

	       
   });

</script>

<div style="width: 100%; height: 100%" bind:this={container}></div>