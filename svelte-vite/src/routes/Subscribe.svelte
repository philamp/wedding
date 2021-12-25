<script>
import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';

//	export let name;

// !!! une rpeonse family attending false implique un booking refusé

// une personne aux champs nom prenom vide puis supprimer pourrait faire planter l'insertion en base

onMount(() => {
		if(document.cookie){
			familyData()
		}
	})

	let currentStep = 1;

	let displayStep2Popin = false

	let QRValueSvelte;

	let formValues;

	let loading = false;

	const triggerQR = () => {

		window.startQRScan();

	};

	window.QRreturn = (QRValue) => {
		QRValueSvelte = QRValue;
		authenticate()
	}




	async function authenticate() {
		loading = true
		const res = await fetch('/api/auth', {
			method: 'POST',
			body: JSON.stringify({
				QRValueSvelte,
			}),
			headers: {
    			'Accept': 'application/json',
    			'Content-Type': 'application/json'
			}
		
		})
		
		const json = await res.json()

		if(json.error){console.log(json.error);loading = false;return}

		familyData()

		/*result = JSON.stringify(json)*/ 


	}

	/*use cookie data*/
	async function familyData() {
		loading = true
		const res = await fetch('/api/familydata', {
			method: 'GET'
		})
		
		const json = await res.json()
		loading = false
		if(json.error){return}
		formValues = json.data.allFamilies.nodes[0]
		/*result = JSON.stringify(json)*/ 
		currentStep = 2;
		console.log(formValues)


	}



	const deletePerson = (i) => {
		formValues.peopleByFamilyId.nodes[i].attending = false;
		if (formValues?.peopleByFamilyId?.nodes?.filter(arg => arg.attending).length < 1) {
		formValues.dinerAttending = false
		formValues.cocktailAttending = false
			//reboot people attending to max
			for(let i = 0; i < formValues.peopleByFamilyId.nodes.length; i++ ){
					formValues.peopleByFamilyId.nodes[i].attending = true
			}
		}
	}

	const restorePerson = () => {
		for(let i = 0; i < formValues.peopleByFamilyId.nodes.length; i++ ){
			if(formValues.peopleByFamilyId.nodes[i].attending == false){
				formValues.peopleByFamilyId.nodes[i].attending = true
				return;
			}
		}
	}
	
	const pushFamilyData = async () => {

		/*empecher valeur absurdes tel que cocktail false et diner true */
		

		loading = true
		const res = await fetch('/api/pushfamilydata', {
			method: 'POST',
			body: JSON.stringify(formValues),
			headers: {
    			'Accept': 'application/json',
    			'Content-Type': 'application/json'
			}
		
		})
		
		const json = await res.json()
		
		if(!json.error){
		currentStep += 1
		loading = false
		}
	}

	/* si step 2 et reponse negatif : mettre au step de la dédicace photo !!! */

	const pushFamilyDataPopin = () => {

		if(formValues.cocktailAttending){pushFamilyData();return}else{

			displayStep2Popin = true;

		}

	}


	

	const tangledCheckboxes = () => {
		if(formValues.guestLevel >= 2){
			formValues.dinerAttending = formValues.cocktailAttending
		}
	}
	

	$: attendingPeopleCount = formValues?.peopleByFamilyId?.nodes?.filter(arg => arg.attending).length
	$: displayAddButton = (attendingPeopleCount === formValues?.peopleByFamilyId?.nodes?.length) ? false : true
	$: displayDeleteButton = (attendingPeopleCount <= 1) ? false : true /* n'est plus utilisé !!! */



</script>

<div id="formtabs" class="max-w-2xl">
<!-- BEGIN TAB 1 / QR CODE -->

<div tabindex="0" class="collapse border rounded-box bg-base-100 border-base-300 m-2 shadow-lg" class:bg-accent={currentStep > 1} class:collapse-open={currentStep === 1} class:collapse-close={currentStep !== 1} on:click={() => currentStep >= 1 ? currentStep = 1 : currentStep}> 
	<div class="collapse-title text-xl font-medium">
	  S'identifier avec le carton
	</div> 
	<div class="collapse-content">
  

  
  <button class="btn btn-lg btn-primary" on:click={triggerQR}>
  
  <svg xmlns="http://www.w3.org/2000/svg" class="inline-block w-12 h-12 mr-2 stroke-current" viewBox="0 0 45 45" fill="none" x="0px" y="0px"><path fill-rule="evenodd" clip-rule="evenodd" d="M9 12C9 10.3431 10.3431 9 12 9H13.6129C14.1652 9 14.6129 9.44772 14.6129 10C14.6129 10.5523 14.1652 11 13.6129 11H12C11.4477 11 11 11.4477 11 12V14.1481C11 14.7004 10.5523 15.1481 10 15.1481C9.44772 15.1481 9 14.7004 9 14.1481V12Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M9 36C9 37.6569 10.3431 39 12 39H13.6129C14.1652 39 14.6129 38.5523 14.6129 38C14.6129 37.4477 14.1652 37 13.6129 37H12C11.4477 37 11 36.5523 11 36V33.8519C11 33.2996 10.5523 32.8519 10 32.8519C9.44772 32.8519 9 33.2996 9 33.8519V36Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M39 12C39 10.3431 37.6569 9 36 9H34.3871C33.8348 9 33.3871 9.44772 33.3871 10C33.3871 10.5523 33.8348 11 34.3871 11H36C36.5523 11 37 11.4477 37 12V14.1481C37 14.7004 37.4477 15.1481 38 15.1481C38.5523 15.1481 39 14.7004 39 14.1481V12Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M39 36C39 37.6569 37.6569 39 36 39H34.3871C33.8348 39 33.3871 38.5523 33.3871 38C33.3871 37.4477 33.8348 37 34.3871 37H36C36.5523 37 37 36.5523 37 36V33.8519C37 33.2996 37.4477 32.8519 38 32.8519C38.5523 32.8519 39 33.2996 39 33.8519V36Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M14 16C14 14.8954 14.8954 14 16 14H18.5C19.6046 14 20.5 14.8954 20.5 16V18.5C20.5 19.6046 19.6046 20.5 18.5 20.5H16C14.8954 20.5 14 19.6046 14 18.5V16ZM18.5 16H16V18.5H18.5V16Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M14 29.5C14 28.3954 14.8954 27.5 16 27.5H18.5C19.6046 27.5 20.5 28.3954 20.5 29.5V32C20.5 33.1046 19.6046 34 18.5 34H16C14.8954 34 14 33.1046 14 32V29.5ZM18.5 29.5H16V32H18.5V29.5Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M27.5 16C27.5 14.8954 28.3954 14 29.5 14H32C33.1046 14 34 14.8954 34 16V18.5C34 19.6046 33.1046 20.5 32 20.5H29.5C28.3954 20.5 27.5 19.6046 27.5 18.5V16ZM32 16H29.5V18.5H32V16Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M22.5263 15C22.5263 14.4477 22.974 14 23.5263 14H24.9474C25.4997 14 25.9474 14.4477 25.9474 15V19.5C25.9474 20.0523 25.4997 20.5 24.9474 20.5H22.5789C22.0267 20.5 21.5789 20.0523 21.5789 19.5C21.5789 18.9477 22.0267 18.5 22.5789 18.5H23.9474V16H23.5263C22.974 16 22.5263 15.5523 22.5263 15ZM19.5 22C20.0523 22 20.5 22.4477 20.5 23V25.25C20.5 25.8023 20.0523 26.25 19.5 26.25H15C14.4477 26.25 14 25.8023 14 25.25C14 24.6977 14.4477 24.25 15 24.25H18.5V23C18.5 22.4477 18.9477 22 19.5 22ZM22.5789 22C23.1312 22 23.5789 22.4477 23.5789 23V25.25C23.5789 25.8023 23.1312 26.25 22.5789 26.25C22.0267 26.25 21.5789 25.8023 21.5789 25.25V23C21.5789 22.4477 22.0267 22 22.5789 22ZM28 23C28 22.4477 28.4477 22 29 22H33C33.5523 22 34 22.4477 34 23C34 23.5523 33.5523 24 33 24H29C28.4477 24 28 23.5523 28 23ZM22.5789 27.5C23.1312 27.5 23.5789 27.9477 23.5789 28.5V33C23.5789 33.5523 23.1312 34 22.5789 34C22.0267 34 21.5789 33.5523 21.5789 33V28.5C21.5789 27.9477 22.0267 27.5 22.5789 27.5Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M25.2929 25.9987C25.4804 25.8112 25.7348 25.7059 26 25.7059L33 25.7059C33.5523 25.7059 34 26.1536 34 26.7059C34 27.2582 33.5523 27.7059 33 27.7059L27 27.7059V33C27 33.5523 26.5523 34 26 34C25.4477 34 25 33.5523 25 33V26.7059C25 26.4406 25.1054 26.1863 25.2929 25.9987Z" fill="black"/><path d="M30.5 29.9C30.5 30.4523 30.0523 30.9 29.5 30.9C28.9477 30.9 28.5 30.4523 28.5 29.9C28.5 29.3477 28.9477 28.9 29.5 28.9C30.0523 28.9 30.5 29.3477 30.5 29.9Z" fill="black"/><path d="M27 23C27 23.5523 26.5523 24 26 24C25.4477 24 25 23.5523 25 23C25 22.4477 25.4477 22 26 22C26.5523 22 27 22.4477 27 23Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M33 29C33.5523 29 34 29.4477 34 30V33C34 33.5523 33.5523 34 33 34H29C28.4477 34 28 33.5523 28 33C28 32.4477 28.4477 32 29 32H32V30C32 29.4477 32.4477 29 33 29Z" fill="black"/></svg>
  
		Scanner le QR-CODE
	  
  </button> 
  
  <form on:submit|preventDefault={authenticate}>
	 <div class="form-control"> 
	<label for="code-input" class="label">
	  <span class="label-text">Ou saisissez le code dans le champ ci-dessous:</span>
	</label> 
	<div class="relative">
	  <input type="text" id="code-input" placeholder="XXXXX-XXXXX" bind:value={QRValueSvelte} class="w-full pr-16 input input-primary input-bordered" required> 
	  <button type="submit" class="absolute top-0 right-0 rounded-l-none btn btn-secondary" class:loading={loading} value="Valider">Valider</button>
	</div>
   </div> 
  </form>
  
	</div>
  </div> 

<!-- END TAB 1 / QR CODE -->

  <!-- BEGIN SHOW BLOCKS AFTER QRCODE SUCCESS -->
  {#if formValues}


<!-- BEGIN TAB 2 / ANSWER + PEOPLE V2-->
<div tabindex="0" class="collapse border rounded-box border-base-300 m-2 collapse-close bg-base-100 shadow-lg" class:bg-accent={currentStep > 2} class:collapse-open={currentStep === 2} class:collapse-close={currentStep !== 2} on:click={() => currentStep >= 2 ? currentStep = 2 : currentStep}> 
<div class="collapse-title text-xl font-medium">
  Réponse et invités
</div> 
<div class="collapse-content">
<!-- content-->

<!-- popin confirmation que la personne ne vient pas -->
<input type="checkbox" id="my-modal-2" class="modal-toggle" bind:checked={displayStep2Popin}> 
<div class="modal">
  <div class="modal-box">
	<p>êtes vous certain(e)(s) de ne pas venir ? Vous allez nous manquer :(</p> 
	<div class="modal-action">
	  <label for="my-modal-2" class="btn btn-primary" on:click={pushFamilyData}>Oui, je suis certain</label> 
	  <label for="my-modal-2" class="btn">Attendez, je reflechis encore</label>
	</div>
  </div>
</div>

<div class="alert alert-info my-2 alert-sm">
	<div class="flex-1">
	  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 mx-2 stroke-current">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>                          
	  </svg> 
	  <label>Vous êtes invité(e)(s) au cocktail {#if formValues.guestLevel >= 2}et au dîner{/if}</label>
	</div>
</div>
<form on:submit|preventDefault={pushFamilyDataPopin}>

<!-- Votre réponse -->
<fieldset class="flex flex-row flex-wrap border-2 border-base-100 rounded-box shadow-lg p-2 my-4">
<legend>Votre réponse:</legend>
	<label class="cursor-pointer label"><span class="label-text">Nous venons avec plaisir:</span> <input type="checkbox" bind:checked={formValues.cocktailAttending} on:change={tangledCheckboxes} class="toggle toggle-secondary"></label>
	{#if formValues.cocktailAttending}
	{#if formValues.guestLevel >= 2}
	  <label class="cursor-pointer label"><span class="label-text">Nous venons aussi au diner (avec plaisir aussi):</span> <input type="checkbox" bind:checked={formValues.dinerAttending} class="toggle toggle-secondary"></label>
	{/if}
	{/if}
</fieldset>

<!--Bloc membres-->
{#if formValues.cocktailAttending}

<!-- Boucle sur les membres-->
{#each formValues.peopleByFamilyId.nodes as person,i}
{#if person.attending}
<fieldset class="flex flex-row flex-wrap border-2 border-base-100 rounded-box shadow-lg p-2 my-4" transition:fly={{ x: -200, duration: 500 }}>
	<legend>{person.firstName} {person.lastName}</legend>
<label class="cursor-pointer label">
<input type="text" placeholder="Prénom" class="input input-sm input-bordered" bind:value={person.firstName} required>
</label>
<label class="cursor-pointer label">
<input type="text" placeholder="Nom de famille" class="input input-sm input-bordered" bind:value={person.lastName} required>
</label>

<label class="cursor-pointer label">
<select class="select select-bordered select-sm w-full max-w-xs" bind:value={person.ageRange}>
  <option>bebe</option> 
  <option>enfant</option> 
  <option>adulte</option>
</select> 
</label>


<label class="label">
<button class="btn btn-secondary btn-sm" on:click|preventDefault={() => deletePerson(i)}>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-4 h-4 mr-2 stroke-current">   
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>                       
  </svg>
	Suppr.
</button> 
</label>


</fieldset>
{/if}
{/each}

<!-- fin Boucle sur les membres-->

<!--Bouton dajout-->
{#if displayAddButton}
<button class="btn btn-secondary float-left" on:click|preventDefault={restorePerson}>
	Ajouter une personne
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-4 h-4 ml-2 stroke-current">  
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>                        
</svg>
  </button> 
  {/if}
<!--fin Bouton dajout-->



{/if}
<!-- fin Bloc membres-->

  
<br/>

<button type="submit" class="btn btn-secondary float-right" class:loading={loading}>Valider</button> 


  </form>
<!--end content-->
</div>
</div>


<!-- END TAB 2 / ANSWER + PEOPLE V2 -->

<!-- BEGIN TAB 3 / ALLERGIES -->
  
  
  
  <div tabindex="0" class="collapse border rounded-box border-base-300 collapse-close m-2 bg-base-100 shadow-lg" class:bg-accent={currentStep > 3} class:collapse-open={currentStep === 3} class:collapse-close={currentStep !== 3} on:click={() => currentStep >= 3 ? currentStep = 3 : currentStep}> 
	<div class="collapse-title text-xl font-medium">
	  Remarques / Allergies
	</div> 
	<div class="collapse-content"> 
  
	  <div class="alert alert-info my-2 alert-sm">
	<div class="flex-1">
	  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 mx-2 stroke-current">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>                          
	  </svg> 
	  <label>Veuillez indiquer ici des remarques concernant les potentielles allergies et/ou régime alimentaire de chacun</label>
	</div>
  </div>



  <form on:submit|preventDefault={pushFamilyData}>
  {#each formValues.peopleByFamilyId.nodes as person,i}
	{#if person.attending}

  <div class="form-control my-2">
	<label class="label">
	  <span class="label-text">Remarques concernant {person.firstName} {person.lastName} (facultatif)</span>
	</label> 
	<textarea class="textarea h-24 textarea-bordered textarea-secondary" placeholder="Example : Kevin est allergique à la viande de mamouth" bind:value={person.foodRemarks}></textarea>
  </div> 

  {/if}
  {/each}
  
  
  <button type="submit" class="btn btn-secondary float-right" class:loading={loading}>Valider</button>
</form>
  </div>
  </div>

<!-- END TAB 3 / ALLERGIES -->
  
<!-- BEGIN TAB 4 / CONTACT -->
  
  <div tabindex="0" class="collapse border rounded-box border-base-300 collapse-close m-2 shadow-lg bg-base-100" class:bg-accent={currentStep > 4} class:collapse-open={currentStep === 4} class:collapse-close={currentStep !== 4} on:click={() => currentStep >= 4 ? currentStep = 4 : currentStep}> 
	<div class="collapse-title text-xl font-medium">
	  Contact
	</div> 
	<div class="collapse-content"> 

		<form on:submit|preventDefault={pushFamilyData}>
  <div class="form-control my-2">
	<label class="label">
	  <span class="label-text">Adresse e-mail (pour vours prévenir des aléas COVID)</span>
	</label> 
	<input type="text" placeholder="françois@hollande.fr" class="input input-primary input-bordered" bind:value={formValues.emailAddress} required pattern="[^@\s]+@[^@\s]+\.[^@\s]+">
  </div> 
  
	<label class="label">
	  <span class="label-text">Numero de téléphone (facultatif)</span>
   </label> 
  
  
  <div class="form-control float-left">
  <select class="select select-bordered w-full max-w-xs " bind:value={formValues.phoneCountryCode}>
	<option disabled="disabled" selected="selected" value="+33">-Indicatif-</option> 
	<option value="+33">+33 - France</option> 
	<option value="+41">+41 - Suisse</option> 
	<option value="+78">+78 - Espagne</option>
  </select>
  </div> 
  
  <div class="form-control">
  
	<input type="text" placeholder="076 548 454 654" class="input input-primary input-bordered" bind:value={formValues.phone}>
  </div> 
  
   
  
  
  
  
  <button type="submit" class="btn btn-secondary float-right" class:loading={loading}>Valider</button>
  </form>
	</div>
	</div>

<!-- END TAB 4 / CONTACT -->
  
<!-- BEGIN TAB 5 / BOOKING -->
  
  <div tabindex="0" class="collapse border rounded-box border-base-300 collapse-open m-2 bg-base-100 shadow-lg"> 
	<div class="collapse-title text-xl font-medium">
	  Logement(s)
	</div> 
	<div class="collapse-content"> 
  
  <div class="overflow-x-auto">
	<table class="table w-full">
	  <thead>
		<tr>
		   
		  <th colspan="2">Nous vous proposons les logements suivants :</th> 
		  
		</tr>
	  </thead> 
	  <tbody>
		<tr class="">
		   
		  <td>Lit double + 2 enfants</td> 
  
		   <td><select class="select select-bordered w-full max-w-xs ">
	<option disabled="disabled" selected="selected" value="+33">-Indicatif-</option>
	<option value="+33">+33 - France</option> 
	<option value="+41">+41 - Suisse</option> 
	<option value="+78">+78 - Espagne</option>
  </select></td>
		  
		</tr>
		<tr class="">
		  
		  <td>Lit double + 3 enfants</td> 
  
		  <td><select class="select select-bordered w-full max-w-xs ">
	<option disabled="disabled" selected="selected">-Indicatif-</option> 
	<option>+33 - France</option> 
	<option>+41 - Suisse</option> 
	<option>+78 - Espagne</option>
  </select></td>
		  
	  </tbody>
	</table>
  </div>
  
  
  
  
  
  
  
	</div>


	

  </div>

<!-- END TAB 5 / BOOKING -->

  {/if}
<!-- END SHOW BLOCKS AFTER QRCODE SUCCESS -->

</div>