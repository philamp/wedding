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
            zIndex: (card.section == "program" ? 1000 : (card.section == "logements" ? 100 : 10)),
            label: null,
            icon: (card.section == "logements" ? "/icons/hotel_0star.png" : (
              card.section == "avisiter" ? "/icons/castle-2.png" : (
                bottomLink.markerId == "eglise" ? "/icons/church-2.png" : "/icons/carsix.png"
              )

            )
            )

            });


            const fillWindow = (fromMap) => {
                infoWindow.close();
                infoWindow.setContent(`<h3 class="block mt-1 text-lg leading-tight font-medium text-black">${card.title == "Localiser la(les) chambre(s)" ? bottomLink.label : card.title}</h3><br/><a href="https://www.google.com/maps/dir/?api=1&destination=${bottomLink.lat},${bottomLink.lng}" class="my-1 btn btn-secondary btn-xs" title="" target="_blank">Itinéraire dans maps</a><br/><label for="my-drawer-2" class="my-1 btn btn-secondary btn-xs" onclick="window.location.href = location.protocol + '//' + location.host + '/#/M/${card.section}/${bottomLink.mapMarkerId}'">Afficher les détails</label>`);
                infoWindow.open(map, marker);
                if(card.title2){
                  map.setMapTypeId("hybrid");
                  if(!fromMap){
                  map.setZoom(18);
                  }
                }else{
                  if(!fromMap){
                  map.setZoom(11);
                  }
                  map.setMapTypeId("roadmap")
                }
            }

            marker.addListener("click", () => {fillWindow(true)});

            // dont put the event on bottomlink if not present -> always present
            document.getElementById("M-"+bottomLink.mapMarkerId).onclick = () => {fillWindow(false)}
              

            }
  
        });

      });
         
        

	       
   });

</script>

<div style="width: 100%; height: 100%" bind:this={container}></div>