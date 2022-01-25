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
           
           /*,
           styles : 
            [
                {
        "featureType": "all",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "weight": "2.00"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#9c9c9c"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f2f2f2"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#eeeeee"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#7b7b7b"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#46bcec"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#c8d7d4"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#070707"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    }
]*/
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