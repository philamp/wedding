
<script>
import Map from './Map.svelte';
import { storeReady } from './../store.js';



</script>

<div id="mapDrawer" class="rounded-lg shadow drawer drawer-end drawer-mobile">
  <input id="my-drawer-2" type="checkbox" class="drawer-toggle"> 
  <div class="drawer-content py-[4rem]">
    
    <div id="central-content">

    
    <h2 class="my-4 mx-4 text-2xl font-bold text-primary">Hôtels & Gîtes aux environs (recommandés par Fabienne Calvo)</h2>

    <div class="max-w-4xl bg-white rounded-xl shadow-md overflow-hidden mx-4 my-4">
      <div class="xl:flex">
        <div class="xl:w-5/12 md:shrink-0">
          <img class="object-cover h-64 w-full" src="/static_pictures/Acrobat_OsaafrQ0av.png" alt="">
        </div>
        <div class="p-4">
          <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">3 chambres + 2 chambres</div>
          <a href="#" class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">CHATEAU DU PARC</a>
          <p class="mt-2 text-slate-500">Mme Micheline Morice<br/>
            Le Parc, 27270 Grand-Camp<br/>
            Tel : +33 (0) 2 32 44 71 03<br/>
            E-mail : giteleparc.morice@orange.fr<br/>
            www.giteleparc.com</p>
        </div>
      </div>
    </div>


    <div class="max-w-4xl bg-white rounded-xl shadow-md overflow-hidden mx-4 my-4">
      <div class="xl:flex">
        <div class="xl:w-5/12 md:shrink-0">
          <img class="object-cover h-64 w-full" src="/static_pictures/gdAWpkq.png" alt="">
        </div>
        <div class="p-4">
          <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">5 chambres</div>
          <a href="#" class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">AUBERGE DU VIEUX DONJON </a>
          <p class="mt-2 text-slate-500">19, rue de la Soie, 27800 Brionne <br/>
            Tel : +33 (0) 2 32 44 80 62  <br/>
            Email : aubergeduvieuxdonjon@orange.fr</p>
        </div>
      </div>
    </div>

    <div class="max-w-4xl bg-white rounded-xl shadow-md overflow-hidden mx-4 my-4">
      <div class="xl:flex">
        <div class="xl:w-5/12 md:shrink-0">
          <img class="object-cover h-64 w-full" src="/static_pictures/aMsgGea.png" alt="">
        </div>
        <div class="p-4">
          <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">12 chambres</div>
          <a href="#" class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">LE LOGIS DE BRIONNE</a>
          <p class="mt-2 text-slate-500">
            1, Place Saint-Denis, 27800 Brionne <br/>
            Tel : +33 (0) 2 32 44 81 73  <br/>
            Email : lelogisdebrionne@orange.fr <br/>
            www.lelogisdebrionne.com </p>
        </div>
      </div>
    </div>


    <div class="max-w-4xl bg-white rounded-xl shadow-md overflow-hidden mx-4 my-4">
      <div class="xl:flex">
        <div class="xl:w-5/12 md:shrink-0">
          <img class="object-cover h-64 w-full" src="/static_pictures/tZ04d0e.png" alt="">
        </div>
        <div class="p-4">
          <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">50 chambres </div>
          <a href="#" class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">ACROPOLE HÖTEL </a>
          <p class="mt-2 text-slate-500">

            10, Rue de la Grande Malouve, 27300 Bernay <br/>
            Tel : +33 (0) 2 32 46 06 06 <br/>
Email : acropolehotel@wanadoo.fr <br/>
www.hotel-acropole.com 
          </p>
        </div>
      </div>
    </div>

    <div class="max-w-4xl bg-white rounded-xl shadow-md overflow-hidden mx-4 my-4">
      <div class="xl:flex">
        <div class="xl:w-5/12 md:shrink-0">
          <img class="object-cover h-64 w-full" src="/static_pictures/2kcCWie.jpeg" alt="">
        </div>
        <div class="p-4">
          <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">23 chambres</div>
          <a href="#" class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">HOTEL DU LION D'OR  </a>
          <p class="mt-2 text-slate-500">
            48, Rue du Général de Gaulle, 27300 Bernay <br/>
            Tel : +33 (0) 2 32 43 12 06 <br/>
            Email : hotelliondor@orange.fr <br/>
            www.hotel-liondor-bernay.com 
          </p>
        </div>
      </div>
    </div>


    
    <div class="max-w-4xl bg-white rounded-xl shadow-md overflow-hidden mx-4 my-4">
      <div class="xl:flex">
        <div class="xl:w-5/12 md:shrink-0">
          <img class="object-cover h-64 w-full" src="/static_pictures/A9104uctl_1spkemx_1as.jpg" alt="">
        </div>
        <div class="p-4">
          <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold"></div>
          <a href="#" class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">AUBERGE DE L'ABBAYE</a>
          <p class="mt-2 text-slate-500">
            12, Place Guillaume le Conquérant, 27800 Le Bec-Hellouin <br/>
            Tel : +33 (0) 2 32 44 86 02 <br/>
            Email : info@hotelbechellouin.com <br/>
            www.hotelbechellouin.com 
          
          </p>
        </div>
      </div>
    </div>

    <div class="max-w-4xl bg-white rounded-xl shadow-md overflow-hidden mx-4 my-4">
      <div class="xl:flex">
        <div class="xl:w-5/12 md:shrink-0">
          <img class="object-cover h-64 w-full" src="/static_pictures/A9rluuiu_1spken0_1as.jpg" alt="">
        </div>
        <div class="p-4">
          <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">9 chambres </div>
          <a href="#" class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">HOSTELLERIE DU LION D'OR </a>
          <p class="mt-2 text-slate-500">
            91, Rue Saint-Nicolas, 27170 Beaumont-le-Roger <br/>
            Tel : +33 (0) 2 32 46 54 24 <br/>
Email : lion-d-or@orange.fr <br/>
www.hostellerie-du-lion-dor.com 
          
          </p>
        </div>
      </div>
    </div>


    <div class="max-w-4xl bg-white rounded-xl shadow-md overflow-hidden mx-4 my-4">
      <div class="xl:flex">
        <div class="xl:w-5/12 md:shrink-0">
          <img class="object-cover h-64 w-full" src="/static_pictures/A973a3gf_1spken3_1as.jpg" alt="">
        </div>
        <div class="p-4">
          <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">6 chambres  </div>
          <a href="#" class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">LE MOULIN FOURET </a>
          <p class="mt-2 text-slate-500">
            2, Route du Moulin Fouret,  <br/>
            27300 Saint-Aubin-le-Vertueux, Treis-Sants-en-Ouche <br/>
            Tel : +33 (0) 2 32 43 19 95 <br/>
            www.lemoulinfouret.fr 
          
          </p>
        </div>
      </div>
    </div>

    <div class="max-w-4xl bg-white rounded-xl shadow-md overflow-hidden mx-4 my-4">
      <div class="xl:flex">
        <div class="xl:w-5/12 md:shrink-0">
          <img class="object-cover h-64 w-full" src="/static_pictures/A91ebq3i0_1spken6_1as.jpg" alt="">
        </div>
        <div class="p-4">
          <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">11 chambres   </div>
          <a href="#" class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">LES GITES DE SOPHIE </a>
          <p class="mt-2 text-slate-500">
            1, allée de la ferme, 27110 Sainte-Opportune-du-Bosc <br/>
            Tel : Florence +33 (0) 6 86 65 75 67 <br/>
            Vincent +33 (0) 6 13 04 44 76 <br/>
            Email : contact@lesgitesdesophie.com <br/>
            www.gitesdesophie.com 
          </p>
        </div>
      </div>
    </div>

    <div class="max-w-4xl bg-white rounded-xl shadow-md overflow-hidden mx-4 my-4">
      <div class="xl:flex">
        <div class="xl:w-5/12 md:shrink-0">
          <img class="object-cover h-64 w-full" src="/static_pictures/A945ts9_1spken9_1as.jpg" alt="">
        </div>
        <div class="p-4">
          <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold"></div>
          <a href="#" class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">LA FERME EN VILLE </a>
          <p class="mt-2 text-slate-500">
            428, Rue de Saint-Nicolas, 27300 Bernay  <br/>
            Tel: +33 (0) 2 32 47 14 03 <br/>
            Email: fabienne@lafermeenville.com
          </p>
        </div>
      </div>
    </div>

    <div class="max-w-4xl bg-white rounded-xl shadow-md overflow-hidden mx-4 my-4">
      <div class="xl:flex">
        <div class="xl:w-5/12 md:shrink-0">
          <img class="object-cover h-64 w-full" src="/static_pictures/A91e7mjy9_1spkenc_1as.jpg" alt="">
        </div>
        <div class="p-4">
          <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold"></div>
          <a href="#" class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">LE ROY MOULIN  </a>
          <p class="mt-2 text-slate-500">
            72, Rue Saint-Vincent, 27290 Glos-sur-Risle, France <br/>
            Mobile: +33 (0) 6 25 92 42 42 <br/>
            Email: contact@leroymoulin.com <br/>
            www.leroymoulin.com
          </p>
        </div>
      </div>
    </div>

    <div class="max-w-4xl bg-white rounded-xl shadow-md overflow-hidden mx-4 my-4">
      <div class="xl:flex">
        <div class="xl:w-5/12 md:shrink-0">
          <img class="object-cover h-64 w-full" src="/static_pictures/A917l0zhn_1spkenf_1as.jpg" alt="">
        </div>
        <div class="p-4">
          <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">3 chambres double + 1 twin </div>
          <a href="#" class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">PETIT MANOIR DU BOSC </a>
          <p class="mt-2 text-slate-500">
            47, Route du Bec Hellouin, 27890 La Neuville-du-Bosc   <br/>
            Mobile: +33 (0) 6 86 79 68 19  <br/>
            Email : petit-manoir-du-bosc@orange.fr  <br/>
            www.petit-manoir-du-bosc.com 
          </p>
        </div>
      </div>
    </div>

    <div class="max-w-4xl bg-white rounded-xl shadow-md overflow-hidden mx-4 my-4">
      <div class="xl:flex">
        <div class="xl:w-5/12 md:shrink-0">
          <img class="object-cover h-64 w-full" src="/static_pictures/A9konhn_1spkeni_1as.jpg" alt="">
        </div>
        <div class="p-4">
          <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">1 suite de 5 couchages + 1 chambre double </div>
          <a href="#" class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">CHEZ MICHELE & GERARD </a>
          <p class="mt-2 text-slate-500">
            Michèle & Gérard DONDON <br/>
            9, Route De Saint-Léger, 27300 Saint-Léger-de-Rôtes <br/>
            Tel: +33 (0) 2 32 43 12 44 <br/>
            Email : michele.don@wanadoo.fr <br/>
            https://chambres-michele.pagesperso-orange.fr
          </p>
        </div>
      </div>
    </div>

    <div class="max-w-4xl bg-white rounded-xl shadow-md overflow-hidden mx-4 my-4">
      <div class="xl:flex">
        <div class="xl:w-5/12 md:shrink-0">
          <img class="object-cover h-64 w-full" src="/static_pictures/A91oo2lko_1spkenl_1as.jpg" alt="">
        </div>
        <div class="p-4">
          <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">46 chambres </div>
          <a href="#" class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">HOTEL THE ORIGINALS ACADINE  </a>
          <p class="mt-2 text-slate-500">
            13, route de Conches, 27110 Le Neubourg <br/>
            Tel: +33 (0) 2 32 36 00 36 <br/>
            Email : hotelacadine@orange.fr <br/>
            www.hotel-acadine-le-neubourg.com 
          </p>
        </div>
      </div>
    </div>

    






    <h2 class="my-4 mx-4 text-2xl font-bold text-primary">Autres gîtes</h2>
    <p class="mt-2 text-slate-500">
    https://www.gites.fr/gites_la-chaumiere_saint-leger-de-rotes_h3575838.htm  <br/>
    https://www.gites.fr/gites_maison-de-ville-a-la-campagne-_bernay_h3049052.htm  <br/>
    https://www.gites.fr/gites_le-petit-moulinsard_bernay_h2882575.htm  <br/>
    https://www.gites.fr/gites_les-bras-de-la-risle_brionne_h3728421.htm  <br/>
    https://www.gites.fr/gites_les-roulottes-de-la-risle_calleville_26238.htm 
  </p>

    <h2 class="my-4 mx-4 text-2xl font-bold text-primary">AirBNB</h2>
    <p class="mt-2 text-slate-500">
    https://www.airbnb.fr/rooms/36754325?source_impression_id=p3_1570539717_8s7 <br/>
    https://www.airbnb.fr/rooms/23725658?source_impression_id=p3_1570540275_PE <br/>
    https://www.airbnb.fr/rooms/21442204?source_impression_id=p3_1570540319_e8z <br/>
    https://www.airbnb.fr/rooms/18537940?source_impression_id=p3_1570540353_Tfh
  </p>
  
</div><!--END CENTRAL CONTENT--> 

  </div> 
  <div class="drawer-side">
    <label for="my-drawer-2" class="drawer-overlay"></label> 
    <div class="menu overflow-y-auto w-10/12 bg-base-100 text-base-content md:w-10/12 lg:w-[22rem] xl:w-[25rem] 2xl:w-[45rem]">
      {#if $storeReady}
      <Map></Map>
      {/if}
    </div>
  </div>
</div>
<style global lang="postcss">

	#mapDrawer{
margin-top: -65px;

  }

  </style>

