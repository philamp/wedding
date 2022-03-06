
<script>
import Map from './Map.svelte';
import { storeReady } from './../store.js';



</script>

<div id="mapDrawer" class="rounded-lg shadow drawer drawer-end drawer-mobile">
  <input id="my-drawer-2" type="checkbox" class="drawer-toggle"> 
  <div class="drawer-content py-[4rem]">
    
    

    
    <h2 class="my-4 mx-4 text-2xl font-bold text-primary">A visiter dans la région</h2>




    <div class="max-w-4xl bg-white rounded-xl shadow-md overflow-hidden mx-4 my-4">
      <div class="">
        <div class="md:shrink-0">
          <img class="object-cover h-64 w-full" src="/static_pictures/chrome_pmWTj2N2kF.png" alt="">
        </div>
        <div class="p-4">
          <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold"></div>
          <a href="#" class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">Bernay</a>
          <p class="mt-2 text-slate-500">
            Située au cœur de la Normandie, Bernay est labellisée Ville d'art et d'histoire depuis 2011. Elle est la seule commune du département à posséder cette distinction. De  son abbaye du XIe siècle à ses maisons à pans de bois des XVe et XVIe siècles, en passant par l'hôtel de la Gabelle, ses jardins, ses bois sculptés de monstres grimaçants et son musée des Beaux-Arts, Bernay offre des promenades le long de la Charentonne et du Cosnier et propose des circuits découverte. 
            <br/><br/>En savoir  plus: https://www.wivisites.com/search_sites?type=city&address=Bernay,%2027300
          </p>
        </div>
      </div>
    </div>

    <div class="max-w-4xl bg-white rounded-xl shadow-md overflow-hidden mx-4 my-4">
      <div class="">
        <div class="md:shrink-0">
          <img class="object-cover h-64 w-full" src="/static_pictures/chrome_X8suQzp2BF.png" alt="">
        </div>
        <div class="p-4">
          <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold"></div>
          <a href="#" class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">Le Bec-Houllin</a>
          <p class="mt-2 text-slate-500">
            Le village du Bec-Hellouin est classé parmi les Plus Beaux Villages de France.
            Découvrez un charmant village authentiquement normand dans la vallée du Bec. Les maisons à pans de bois, les ruelles fleuries, la place aux hêtres invitent à la flânerie. En contrebas, découvrez la somptueuse Abbaye Notre-Dame, fondée au XIe siècle. Elle est toujours en activité grâce à une communauté de moines bénédictins. 
            <br/><br/>En savoir plus : https://www.wivisites.com/monument_details?site=6ffbc3b9-a699-49d6-bff6-26a6231177b8
            
          </p>
        </div>
      </div>
    </div>

    <div class="max-w-4xl bg-white rounded-xl shadow-md overflow-hidden mx-4 my-4">
      <div class="">
        <div class="md:shrink-0">
          <img class="object-cover h-64 w-full" src="/static_pictures/chrome_9Knin8nSWO.png" alt="">
        </div>
        <div class="p-4">
          <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold"></div>
          <a href="#" class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">Château et Domaine d’Harcourt</a>
          <p class="mt-2 text-slate-500">
            Le Château d'Harcourt est l'un des châteaux médiévaux les mieux conservés de Normandie. L’édifice domine un superbe arboretum installé depuis 1802, et considéré comme le plus ancien de France. Ce conservatoire à vocation scientifique et pédagogique, qui offre une synthèse du peuplement arboré des 5 continents, demeure un très agréable lieu de promenade.
             <br/><br/>En savoir plus : https://www.wivisites.com/monument_details?site=34ebea9d-3485-428b-9866-b240ea8e9fd1
             <br/><br/>Site du domaine : https://www.harcourt-normandie.fr/
            
          </p>
        </div>
      </div>
    </div>

    <div class="max-w-4xl bg-white rounded-xl shadow-md overflow-hidden mx-4 my-4">
      <div class="">
        <div class="md:shrink-0">
          <img class="object-cover h-64 w-full" src="/static_pictures/chrome_VhsJRA5fO1.png" alt="">
        </div>
        <div class="p-4">
          <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold"></div>
          <a href="#" class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">Château du Champ de Bataille</a>
          <p class="mt-2 text-slate-500">
            Édifié au XVIIe siècle pour le maréchal de Créqui, l'imposant château du Champ de Bataille est la propriété de Jacques Garcia, célèbre décorateur et collectionneur d'art, qui entreprit sa restauration dès 1992, ainsi que la création de somptueux jardins à la française. Classés Jardin Remarquable, ces derniers, réalisés à partir d'un croquis attribué à Le Nôtre, restituent toute la splendeur d'antan. Le château abrite une prestigieuse collection de meubles et objets royaux et princiers.
             <br/><br/>En savoir plus : https://www.wivisites.com/monument_details?site=d0fa71ac-5dcb-487a-bc24-67edd583561e
             <br/><br/>Site du château : https://www.chateauduchampdebataille.com/
            
          </p>
        </div>
      </div>
    </div>


    <div class="max-w-4xl bg-white rounded-xl shadow-md overflow-hidden mx-4 my-4">
      <div class="">
        <div class="md:shrink-0">
          <img class="object-cover h-64 w-full" src="/static_pictures/chrome_NXZtmPIcco.png" alt="">
        </div>
        <div class="p-4">
          <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold"></div>
          <a href="#" class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">Château de Beaumesnil</a>
          <p class="mt-2 text-slate-500">
            Le château de Beaumesnil est un magnifique exemple d’architecture du début du XVIIe siècle avec ses façades de briques et de pierres richement décorées. Le château, entièrement meublé, abrite également une collection de reliures anciennes dans la bibliothèque. Cet ensemble exceptionnel est entouré de 4 ha de jardins à la française.
             <br/><br/>En savoir plus : https://www.wivisites.com/monument_details?site=254a2529-049b-431c-9f45-9cc94b98fd8d
             <br/><br/>Site du château : https://www.chateaubeaumesnil.com
            
          </p>
        </div>
      </div>
    </div>


    <div class="max-w-4xl bg-white rounded-xl shadow-md overflow-hidden mx-4 my-4">
      <div class="">
        <div class="md:shrink-0">
          <img class="object-cover h-64 w-full" src="/static_pictures/chrome_sFTNtJLFnv.png" alt="">
        </div>
        <div class="p-4">
          <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold"></div>
          <a href="#" class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">Pont-Audemer</a>
          <p class="mt-2 text-slate-500">
            Cette ancienne cité de tanneurs possède un centre-ville typique du Moyen-Âge, dont l’urbanisme et l’architecture sont les témoins de son riche passé industriel : maisons à colombages, anciens séchoirs à peaux et hôtels particuliers les pieds dans l’eau, côtoient les ponts de pierre et les canaux.
             <br/><br/>En savoir plus : https://www.wivisites.com/monument_details?site=6145ccb1-d835-414f-8596-0d93090176b4
            
          </p>
        </div>
      </div>
    </div>


    
    <div class="max-w-4xl bg-white rounded-xl shadow-md overflow-hidden mx-4 my-4">
      <div class="">
        <div class="md:shrink-0">
          <img class="object-cover h-64 w-full" src="/static_pictures/chrome_btKi4bU1kr.png" alt="">
        </div>
        <div class="p-4">
          <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold"></div>
          <a href="#" class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">Marais-Vernier</a>
          <p class="mt-2 text-slate-500">
            Ancien méandre de la Seine, le Marais Vernier constitue une vaste zone humide de 4500 ha située sur un important couloir de migration des oiseaux. Véritable amphithéâtre naturel, cette micro région exceptionnelle est reconnue au niveau européen pour la richesse de sa faune et sa flore.

             <br/><br/>En savoir plus : https://www.normandie-tourisme.fr/beaux-detours/marais-vernier/
            
          </p>
        </div>
      </div>
    </div>

    <div class="max-w-4xl bg-white rounded-xl shadow-md overflow-hidden mx-4 my-4">
      <div class="">
        <div class="md:shrink-0">
          <img class="object-cover h-64 w-full" src="/static_pictures/chrome_2mKmbl3KpM.png" alt="">
        </div>
        <div class="p-4">
          <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold"></div>
          <a href="#" class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">Evreux</a>
          <p class="mt-2 text-slate-500">
            La capitale de l'Eure possède un riche passé : ancienne cité romaine, dont les vestiges restent encore bien visibles le long des berges de l'Iton, ville médiévale importante, qualifiée au XVIIIe siècle par Madame de Sévigné de " plus jolie ville de Normandie ", Evreux offre aujourd'hui un visage particulièrement contrasté. Si de beaux bâtiments anciens subsistent, le cœur du centre-ville, détruit à plus de 80 % pendant la Seconde Guerre mondiale, a été reconstruit dans les années 1950 et 1960. La majestueuse cathédrale, fondée au Xe s., partagea les heurs et les malheurs de la ville, parfois brûlée, souvent remaniée. Elle possède de  remarquables vitraux provenant de dons royaux.
            
          </p>
        </div>
      </div>
    </div>


    <div class="max-w-4xl bg-white rounded-xl shadow-md overflow-hidden mx-4 my-4">
      <div class="">
        <div class="md:shrink-0">
          <img class="object-cover h-64 w-full" src="/static_pictures/chrome_ll1YbXtLMC.png" alt="">
        </div>
        <div class="p-4">
          <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold"></div>
          <a href="#" class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">Honfleur</a>
          <p class="mt-2 text-slate-500">
            Ville de pêcheurs habillée d'ardoises et ville des peintres, Honfleur comme nul port ailleurs. Monet, Courbet, Boudin et tant d'autres ont fait voyager les pittoresques quais de Honfleur dans le monde. Premier port de la Côte Fleurie en venant de la capitale, cette ville a attiré le Tout-Paris dès le début du XIXe siècle. Toujours aussi nombreux, les artistes continuent à immortaliser le vieux port, animé en toute saison. De hautes maisons normandes serrées autour du vieux bassin forment un décor qui enchante photographes, peintres et flâneurs.
            
            <br/><br/>En savoir plus : https://www.wivisites.com/monument_details?site=c624752b-6294-42db-bcf1-6f48c60b67a2
            
          </p>
        </div>
      </div>
    </div>

    
    <div class="max-w-4xl bg-white rounded-xl shadow-md overflow-hidden mx-4 my-4">
      <div class="">
        <div class="md:shrink-0">
          <img class="object-cover h-64 w-full" src="/static_pictures/chrome_9L7zHomDsA.png" alt="">
        </div>
        <div class="p-4">
          <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold"></div>
          <a href="#" class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">Trouville-sur-mer et Deauville</a>
          <p class="mt-2 text-slate-500">
            Conçue par le Duc de Morny, demi-frère de Napoléon III, Deauville fut créée en 1858 afin d'accueillir la haute société parisienne, avide de bains de mer et de villégiature. Le petit village de Dosville fut métamorphosé en cité balnéaire chic, regorgeant de somptueux manoirs et hôtels, d'un Casino, d'un hippodrome, et d'un golf. 
            <br/><br/>
Séparée de Deauville par une syllabe et une rivière, la Touques, Trouville a su garder son caractère Second Empire et son charme de petit port de pêche. Au fil des Planches, les demeures à l'architecture typique de la région font toujours forte impression. Depuis le début du XIXe siècle, grâce aux bains de mer, la ville attire de grands peintres, artistes ou écrivains.

            
          </p>
        </div>
      </div>
    </div>

    <div class="max-w-4xl bg-white rounded-xl shadow-md overflow-hidden mx-4 my-4">
      <div class="">
        <div class="md:shrink-0">
          <img class="object-cover h-64 w-full" src="/static_pictures/chrome_7xfWCwo75s.png" alt="">
        </div>
        <div class="p-4">
          <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold"></div>
          <a href="#" class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">Etretat</a>
          <p class="mt-2 text-slate-500">
            Pour sa fabuleuse falaise de craie, plongeant à pic dans la mer, Étretat offre l'un des plus beaux panoramas de France. Lieu de contemplation pour les artistes, comme Matisse ou encore Monet, on s'y promène de la grande plage de galets, aux hauteurs, peuplées de maisons normandes de style Belle Epoque.
            <br/><br/>En savoir plus : https://www.wivisites.com/monument_details?site=3a0103e3-57f2-4a4a-9b34-208ee5ad2e1e

            
          </p>
        </div>
      </div>
    </div>



  
  

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

