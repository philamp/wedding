<script>
import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import init from "/src/birds-animated-small.js";
	import { connectionStatus, alert, alertFailure, familyStore } from '/src/store.js';

	//spa router params
	export let params = {}

	let htmlLoaded = false;
	let familyDataLoaded = false;
	



//	export let name;

// !!! une rpeonse family attending false implique un booking refusé -->> utiliser les pg trigers

// une personne aux champs nom prenom vide puis supprimer pourrait faire planter l'insertion en base

onMount(() => {

 

	if(params.urlQrCode){
		QRValueSvelte = params.urlQrCode;
		authenticate()
		}else if(document.cookie){
			familyData()
		}



	const triggered = () => {if(!window.intlTelInputGlobals.getInstance(document.getElementById("phoneinput"))){
		window.intlTelInput(document.getElementById("phoneinput"), {
			separateDialCode: false,	// any initialisation options go here
			utilsScript: "/intl-tel/js/utils.js",
			initialCountry: "fr",
			onlyCountries: ["fr","us","il","es","it","ch"]
		});

	}}	

	triggered();

	htmlLoaded = true;


})

	let currentStep = 1;

	let displayStep2Popin = false;

	let displayStep5Popin = false;

	let displayDayOfArrival = false;

	let toolsArray = [];

	let phoneinput = "";

	let QRValueSvelte;

	let contribution = 0;

	let capacityOptedFor = 0;

	let daysText = "1 nuit";

	let dateArrivalText = "samedi 20";

	let formValues = {
               "familyId": 0,
               "familyName":"",
               "cocktailAttending":true,
               "dinerAttending":false,
               "emailAddress":"",
               "phone":"",
			   "freeBooking": false,
			   "dayOfArrival": "samedi",
               "guestLevel":1,
               "formStep":2,
               "peopleByFamilyId":{
                  "nodes":[]
               },
               "bookingsByFamilyId":{
                  "nodes":[]
               },
			   "toolBookingsByFamilyId":{
                  "nodes":[]
               }
            }

	
 

	let loading = false;
	let addLoading;
	let delLoading;

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

		if(json.error){console.log(json.error);loading = false;$connectionStatus = false;return}
		

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
		if(json.error){console.log(json.error); return}
		//set global connectionstatus
		$connectionStatus = true;
		formValues = json.data.allFamilies.nodes[0]
		$familyStore = formValues
		/*result = JSON.stringify(json)*/ 

		// STEP POSITIONNER : if comprised between >1 & <6, place visotor on the good step if 6 place on 6, anything else is 0 or 1: load 2.
		if(formValues.formStep > 1 && formValues.formStep < 6){currentStep = formValues.formStep + 1}else 
		if(formValues.formStep == 6){currentStep = formValues.formStep}
		else{
			currentStep = 2
		}
		familyDataLoaded = true;
		
		// sub default vendredi for max-dayed people (not constrained secured server side !!!)
		if(formValues.dayOfArrival == null){
			if(formValues.bookingsByFamilyId.nodes.filter(arg => arg.bookingState == "accepted" || arg.bookingState == "pending").length > 0 && formValues.bookingsByFamilyId.nodes.filter(arg => arg.roomByRoomId.maxDays == 1).length < 1){
			formValues.dayOfArrival = "vendredi"
			}else{
			formValues.dayOfArrival = "samedi"
			}
		}

		console.log(formValues);

	}



	//func to get available tools
	async function getTools() {
		//loading = true
		const res = await fetch('/api/tools', {
			method: 'GET'
		})
		
		const json = await res.json()
		//loading = false
		if(json.error){return}
		
		toolsArray = json.data.allViewAvailableTools.nodes;



	}



	const deletePerson = (i) => {
		formValues.peopleByFamilyId.nodes[i].attending = false;

		$alert = formValues.peopleByFamilyId.nodes[i].firstName + " ne vient pas"

		if (formValues.peopleByFamilyId.nodes.filter(arg => arg.attending).length < 1) {
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
				$alert = formValues.peopleByFamilyId.nodes[i].firstName + " vient"
				return;
			}
		}
	}
	
	const pushFamilyData = async (confirmNeeded = true) => {

		// simplification popin, default ask confirmaiton in listed cases
		if(!formValues.cocktailAttending && confirmNeeded && currentStep == 2){
		displayStep2Popin = true;return;
		}

		if(confirmNeeded && currentStep == 5 && formValues.bookingsByFamilyId.nodes.filter(arg => arg.bookingState == "refused" || arg.bookingState == "pending").length > 0){
		displayStep5Popin = true;return;
		}

		let actualSentPhone;
		let actualSentDayOfArrival;
		let actualSentFormValues;
		/*empecher valeur absurdes tel que cocktail false et diner true !!! */
		/* forcer diner false si level 1 *  sur le server  !!!*/
		if(currentStep == 4){
			formValues.phone = window.intlTelInputGlobals.getInstance(document.getElementById("phoneinput")).getNumber();
		}

		// force dayofarrival null if all logement refused
		if(formValues.bookingsByFamilyId.nodes.filter(arg => arg.bookingState == "accepted" || arg.bookingState == "pending").length < 1){
			actualSentDayOfArrival = null;
		}else{
			actualSentDayOfArrival = formValues.dayOfArrival
		}

		actualSentFormValues = {...formValues, formStep: currentStep, dayOfArrival: actualSentDayOfArrival}

		// updates the svelte store

		loading = true
		const res = await fetch('/api/pushfamilydata', {
			method: 'POST',
			body: JSON.stringify(actualSentFormValues),
			headers: {
    			'Accept': 'application/json',
    			'Content-Type': 'application/json'
			}
		
		})
		
		const json = await res.json()
		
		if(!json.error){
		if(!formValues.cocktailAttending && currentStep == 2){
			currentStep = 5
			pushFamilyData()
			// !!! + faire booking refused à la fonfirmation du step 6 !!!
		}else{
			currentStep += 1;
			$alert = "Merci, étape suivante...";
		}

		loading = false

		//document.querySelector('main').scrollTo(0, 0); // reboot scroll after each response !!! verify browser
		}
	}



	const pushToolBookingsData = async (toolsIntermediateObject) => {

		loading = true
		const res = await fetch('/api/pushToolBookingsData', {
			method: 'POST',
			body: JSON.stringify(toolsIntermediateObject),
			headers: {
    			'Accept': 'application/json',
    			'Content-Type': 'application/json'
			}
		
		})
		
		const json = await res.json()
		loading = false


		return json;

	}

	const getOneTool = async (i) => {

	// construct like it would be from DB
	addLoading = i;

	let toolsIntermediateObject =  {
                "toolByToolId": {
                  "toolName": toolsArray[i].toolName,
                  "toolId": toolsArray[i].toolId,
				  "toolType": toolsArray[i].toolType,
				  "price": toolsArray[i].price
                },
                "bookingState": "reserved",
              }
	
	const json = await pushToolBookingsData(toolsIntermediateObject);

	addLoading = null;

	// direct update to DB -> always create through EXPRESS: if familiy id present :: return error if not feasible
	if(json.error)
	{
		console.log("Not enough available")
		$alertFailure = "true";
		$alert = "Il n'y a plus assez de " + toolsArray[i].toolName;
	}
	else
	{
		// add it to the existing formValues tree
		toolsIntermediateObject.toolBookingId = json.data.makeToolBookingv4.toolBooking.toolBookingId;
		formValues.toolBookingsByFamilyId.nodes = [...formValues.toolBookingsByFamilyId.nodes, toolsIntermediateObject];
		console.log(formValues);
		toolsArray[i].remaining -= 1
	}

	



	}

	const delOneTool = async (j) => {
	//deprecated after counter evol !!!

	// construct like it would be from DB
	// console.log(formValues.toolBookingsByFamilyId);

	

	formValues.toolBookingsByFamilyId.nodes[j].bookingState = "open";

	toolsArray[toolsArray.findIndex(arg => arg.toolId == formValues.toolBookingsByFamilyId.nodes[j].toolByToolId.toolId)].remaining += 1
	
	const json = await pushToolBookingsData(formValues.toolBookingsByFamilyId.nodes[j]);

	

		
	}

	const delOneToolBis = async (g) => {

		let i = toolsArray[g].toolId

		// si pas de toolbooking à enelever return
		if (formValues.toolBookingsByFamilyId.nodes.filter(arg => arg.bookingState != "open" && arg.toolByToolId.toolId == i).length > 0){

			delLoading = g;
			//remove one of them
			let found = formValues.toolBookingsByFamilyId.nodes.findIndex(arg => arg.toolByToolId.toolId == i && arg.bookingState != "open")
			formValues.toolBookingsByFamilyId.nodes[found].bookingState = "open";
			const json = await pushToolBookingsData(formValues.toolBookingsByFamilyId.nodes[found]);
			toolsArray[toolsArray.findIndex(arg => arg.toolId == formValues.toolBookingsByFamilyId.nodes[found].toolByToolId.toolId)].remaining += 1

			delLoading = null;
		
		}else{

			return
		}



	}


	

	const tangledCheckboxes = () => {
		if(formValues.guestLevel >= 2){
			formValues.dinerAttending = formValues.cocktailAttending
		}
	}
	

	$: attendingPeopleCount = formValues.peopleByFamilyId.nodes.filter(arg => arg.attending).length
	$: displayAddButton = (attendingPeopleCount === formValues.peopleByFamilyId.nodes.length) ? false : true
	$: displayDeleteButton = (attendingPeopleCount <= 1) ? false : true /* n'est plus utilisé !!! */



$: if(currentStep == 7){

			init("#scene-275138496");
}


$: if(currentStep >= 4){
	let count = 0;
	let money = 0;
	for(let i = 0; i < formValues.bookingsByFamilyId.nodes.length; i++ ){
		if(formValues.bookingsByFamilyId.nodes[i].bookingState == "accepted"){
			count += formValues.bookingsByFamilyId.nodes[i].roomByRoomId.capacity
			money += formValues.dayOfArrival == "vendredi" ? formValues.bookingsByFamilyId.nodes[i].roomByRoomId.twoNightPrice : formValues.bookingsByFamilyId.nodes[i].roomByRoomId.oneNightPrice
		}
	}
	contribution = money
	capacityOptedFor = count;
}

$: daysText = formValues.dayOfArrival == "vendredi" ? "2 nuits" : "1 nuit"

$: dateArrivalText = formValues.dayOfArrival == "vendredi" ? "vendredi 19" : "samedi 20"

$: if(currentStep != 7){
	setTimeout(() => {
		document.querySelector('#divstep-'+currentStep).scrollIntoView();
		document.querySelector('main').scrollBy(0,-100)
	}
	, 100)
}



$: if(currentStep == 5){
// get tools data
getTools();

}

$ : if( formValues.bookingsByFamilyId.nodes.filter(arg => arg.roomByRoomId.maxDays == 1).length < 1 && formValues.bookingsByFamilyId.nodes.filter(arg => arg.bookingState == "accepted" || arg.bookingState == "pending").length > 0){

	displayDayOfArrival = true;

}else{displayDayOfArrival = false}


$: if(htmlLoaded && familyDataLoaded){
	if(formValues.phone){
		window.intlTelInputGlobals.getInstance(document.getElementById("phoneinput")).setNumber(formValues.phone);
	}else{
		//reset to empty
		window.intlTelInputGlobals.getInstance(document.getElementById("phoneinput")).setNumber("");
	}
}

</script>



{#if currentStep >= 5}
<figure id="scene-275138496" style="height: 50px; width: 50px; position: absolute; z-index: 10000"></figure>
{/if}

<div id="central-content">

<div id="formtabs" class="max-w-2xl" style="">
	
<!-- BEGIN TAB 1 / QR CODE -->

<div tabindex="0" id="divstep-1" class="collapse border rounded-box bg-base-100 border-base-300 m-2 shadow-lg" class:bg-accent={currentStep > 1} class:collapse-open={currentStep === 1} class:collapse-close={currentStep !== 1} class:cursor-pointer={currentStep > 1} on:click={() => currentStep >= 1 ? currentStep = 1 : currentStep}> 
	<div class="collapse-title text-xl font-medium">
	  S'identifier <small>avec le carton d'invitation</small>
	</div> 
	<div class="collapse-content">
  

  
  <button class="btn btn-primary" on:click={triggerQR}>
  
  <svg xmlns="http://www.w3.org/2000/svg" class="inline-block w-8 h-8 stroke-current" viewBox="10 10 30 30" fill="none" x="0px" y="0px"><path fill-rule="evenodd" clip-rule="evenodd" d="M9 12C9 10.3431 10.3431 9 12 9H13.6129C14.1652 9 14.6129 9.44772 14.6129 10C14.6129 10.5523 14.1652 11 13.6129 11H12C11.4477 11 11 11.4477 11 12V14.1481C11 14.7004 10.5523 15.1481 10 15.1481C9.44772 15.1481 9 14.7004 9 14.1481V12Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M9 36C9 37.6569 10.3431 39 12 39H13.6129C14.1652 39 14.6129 38.5523 14.6129 38C14.6129 37.4477 14.1652 37 13.6129 37H12C11.4477 37 11 36.5523 11 36V33.8519C11 33.2996 10.5523 32.8519 10 32.8519C9.44772 32.8519 9 33.2996 9 33.8519V36Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M39 12C39 10.3431 37.6569 9 36 9H34.3871C33.8348 9 33.3871 9.44772 33.3871 10C33.3871 10.5523 33.8348 11 34.3871 11H36C36.5523 11 37 11.4477 37 12V14.1481C37 14.7004 37.4477 15.1481 38 15.1481C38.5523 15.1481 39 14.7004 39 14.1481V12Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M39 36C39 37.6569 37.6569 39 36 39H34.3871C33.8348 39 33.3871 38.5523 33.3871 38C33.3871 37.4477 33.8348 37 34.3871 37H36C36.5523 37 37 36.5523 37 36V33.8519C37 33.2996 37.4477 32.8519 38 32.8519C38.5523 32.8519 39 33.2996 39 33.8519V36Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M14 16C14 14.8954 14.8954 14 16 14H18.5C19.6046 14 20.5 14.8954 20.5 16V18.5C20.5 19.6046 19.6046 20.5 18.5 20.5H16C14.8954 20.5 14 19.6046 14 18.5V16ZM18.5 16H16V18.5H18.5V16Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M14 29.5C14 28.3954 14.8954 27.5 16 27.5H18.5C19.6046 27.5 20.5 28.3954 20.5 29.5V32C20.5 33.1046 19.6046 34 18.5 34H16C14.8954 34 14 33.1046 14 32V29.5ZM18.5 29.5H16V32H18.5V29.5Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M27.5 16C27.5 14.8954 28.3954 14 29.5 14H32C33.1046 14 34 14.8954 34 16V18.5C34 19.6046 33.1046 20.5 32 20.5H29.5C28.3954 20.5 27.5 19.6046 27.5 18.5V16ZM32 16H29.5V18.5H32V16Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M22.5263 15C22.5263 14.4477 22.974 14 23.5263 14H24.9474C25.4997 14 25.9474 14.4477 25.9474 15V19.5C25.9474 20.0523 25.4997 20.5 24.9474 20.5H22.5789C22.0267 20.5 21.5789 20.0523 21.5789 19.5C21.5789 18.9477 22.0267 18.5 22.5789 18.5H23.9474V16H23.5263C22.974 16 22.5263 15.5523 22.5263 15ZM19.5 22C20.0523 22 20.5 22.4477 20.5 23V25.25C20.5 25.8023 20.0523 26.25 19.5 26.25H15C14.4477 26.25 14 25.8023 14 25.25C14 24.6977 14.4477 24.25 15 24.25H18.5V23C18.5 22.4477 18.9477 22 19.5 22ZM22.5789 22C23.1312 22 23.5789 22.4477 23.5789 23V25.25C23.5789 25.8023 23.1312 26.25 22.5789 26.25C22.0267 26.25 21.5789 25.8023 21.5789 25.25V23C21.5789 22.4477 22.0267 22 22.5789 22ZM28 23C28 22.4477 28.4477 22 29 22H33C33.5523 22 34 22.4477 34 23C34 23.5523 33.5523 24 33 24H29C28.4477 24 28 23.5523 28 23ZM22.5789 27.5C23.1312 27.5 23.5789 27.9477 23.5789 28.5V33C23.5789 33.5523 23.1312 34 22.5789 34C22.0267 34 21.5789 33.5523 21.5789 33V28.5C21.5789 27.9477 22.0267 27.5 22.5789 27.5Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M25.2929 25.9987C25.4804 25.8112 25.7348 25.7059 26 25.7059L33 25.7059C33.5523 25.7059 34 26.1536 34 26.7059C34 27.2582 33.5523 27.7059 33 27.7059L27 27.7059V33C27 33.5523 26.5523 34 26 34C25.4477 34 25 33.5523 25 33V26.7059C25 26.4406 25.1054 26.1863 25.2929 25.9987Z" fill="black"/><path d="M30.5 29.9C30.5 30.4523 30.0523 30.9 29.5 30.9C28.9477 30.9 28.5 30.4523 28.5 29.9C28.5 29.3477 28.9477 28.9 29.5 28.9C30.0523 28.9 30.5 29.3477 30.5 29.9Z" fill="black"/><path d="M27 23C27 23.5523 26.5523 24 26 24C25.4477 24 25 23.5523 25 23C25 22.4477 25.4477 22 26 22C26.5523 22 27 22.4477 27 23Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M33 29C33.5523 29 34 29.4477 34 30V33C34 33.5523 33.5523 34 33 34H29C28.4477 34 28 33.5523 28 33C28 32.4477 28.4477 32 29 32H32V30C32 29.4477 32.4477 29 33 29Z" fill="black"/></svg>
  
		Scanner le QR-CODE
	  
  </button> 
  
  <form on:submit|preventDefault={authenticate}>


	 <div class="form-control"> 
	<label for="code-input" class="label">
	  <span class="label-text">Ou saisissez le code dans le champ ci-dessous:</span>
	</label> 
	<div class="relative">
	  <input type="text" id="code-input" placeholder="A1B2C3D4" style="text-transform: uppercase" bind:value={QRValueSvelte} class="w-full pr-16 input input-primary input-bordered" required> 
	  <button type="submit" class="absolute top-0 right-0 rounded-l-none btn btn-primary" class:loading={loading} value="Valider">Valider</button>
	</div>
   </div> 
  </form>
  

  <div class="alert alert-info my-2 alert-sm">
	<div class="flex-1">
	  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 mx-2 stroke-current">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>                          
	  </svg> 
	  <label for="">
<small>
	Si le site ne fonctionne pas bien sur votre appareil (quand la mise à jour logicielle remonte à plus de 3 ans), vous pouvez <a href="mailto:phil.gaultier@gmail.com"><span class="underline">répondre par email (phil.gaultier@gmail.com)</span></a>.

</small></label>
	</div>
</div>


	</div>
  </div> 

<!-- END TAB 1 / QR CODE -->




<!-- BEGIN TAB 2 / ANSWER + PEOPLE V2-->
<div tabindex="0" id="divstep-2" class="collapse border rounded-box border-base-300 m-2 collapse-close bg-base-100 shadow-lg" class:bg-accent={currentStep > 2} class:collapse-open={currentStep === 2} class:collapse-close={currentStep !== 2} class:cursor-pointer={currentStep > 2} on:click={() => currentStep >= 2 ? currentStep = 2 : currentStep}> 
<div class="collapse-title text-xl font-medium">
  Réponse et invités
</div> 
<div class="collapse-content">
<!-- content-->

<!-- popin confirmation que la personne ne vient pas -->
<input type="checkbox" id="my-modal-2" class="modal-toggle" bind:checked={displayStep2Popin}> 
<div class="modal">
  <div class="modal-box">
	<p>êtes vous certain(e)(s) ? 😞</p> 
	<div class="modal-action">
	  <label for="my-modal-2" class="btn btn-primary" on:click={() => pushFamilyData(false)}>Oui, je suis certain</label> 
	  <label for="my-modal-2" class="btn">Non, attends !</label>
	</div>
  </div>
</div>

<div class="alert alert-info my-2 alert-sm">
	<div class="flex-1">
	  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 mx-2 stroke-current">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>                          
	  </svg> 
	  <label for="">
		{formValues.familyName}  
		<br/>Vous êtes invité(e)(s) au cocktail {#if formValues.guestLevel >= 2}et au dîner{/if}
	</label>
	</div>
</div>
<form on:submit|preventDefault={pushFamilyData}>

<!-- Votre réponse -->

<fieldset class="flex flex-row flex-wrap border-2 border-base-100 rounded-box shadow-md p-2 my-4">
	<legend>Nous viendrons avec plaisir au cocktail</legend>
	<label class="cursor-pointer label">oui&nbsp;<input type="radio" name="radio-1" class="radio radio-secondary" bind:group={formValues.cocktailAttending} value={true} on:change={tangledCheckboxes}></label>
	<label class="cursor-pointer label">non&nbsp;<input type="radio" name="radio-1" class="radio radio-secondary" bind:group={formValues.cocktailAttending} value={false} on:change={tangledCheckboxes}></label>

</fieldset>

{#if formValues.cocktailAttending && formValues.guestLevel >= 2}
<fieldset class="flex flex-row flex-wrap border-2 border-base-100 rounded-box shadow-md p-2 my-4" transition:fly={{ x: -200, duration: 500 }}>
	<legend>Nous viendrons avec plaisir au dîner</legend>

	<label class="cursor-pointer label">oui&nbsp;<input type="radio" name="radio-2" class="radio radio-secondary" bind:group={formValues.dinerAttending} value={true}></label>
	<label class="cursor-pointer label">non&nbsp;<input type="radio" name="radio-2" class="radio radio-secondary" bind:group={formValues.dinerAttending} value={false}></label>
</fieldset>
{/if}

<!--Bloc membres-->
{#if formValues.cocktailAttending}

<!-- Boucle sur les membres-->
{#each formValues.peopleByFamilyId.nodes as person,i}
{#if person.attending}
<fieldset class="flex flex-row flex-wrap border-2 border-base-100 rounded-box shadow-md p-2 my-4 relative" transition:fly={{ x: -200, duration: 500 }}>
	<legend>{person.firstName} {person.lastName}</legend>

		<label for="" class="btn btn-secondary btn-sm absolute persondelete" on:click={() => deletePerson(i)}><small>enlever</small></label> 

<label class="cursor-pointer label">
<input type="text" placeholder="Prénom" class="input input-sm input-bordered" bind:value={person.firstName} required>
</label>
<label class="cursor-pointer label">
<input type="text" placeholder="Nom de famille" class="input input-sm input-bordered" bind:value={person.lastName} required>
</label>

<label class="cursor-pointer label">
<select class="select select-bordered select-sm w-full max-w-xs" bind:value={person.ageRange}>
  <option>bébé</option> 
  <option>enfant</option> 
  <option>adulte</option>
</select> 
</label>





</fieldset>

{/if}
{/each}

<!-- fin Boucle sur les membres-->

<!--Bouton dajout-->
{#if displayAddButton}
<button class="btn btn-secondary btn-sm float-left" on:click|preventDefault={restorePerson}>
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

<button type="submit" class="btn btn-primary float-right" class:loading={loading}>Valider</button> 


  </form>
<!--end content-->
</div>
</div>


<!-- END TAB 2 / ANSWER + PEOPLE V2 -->

<!-- BEGIN TAB 3 / ALLERGIES -->
  
  
  
  <div tabindex="0" id="divstep-3" class="collapse border rounded-box border-base-300 collapse-close m-2 bg-base-100 shadow-lg" class:bg-accent={currentStep > 3} class:collapse-open={currentStep === 3} class:collapse-close={currentStep !== 3} class:cursor-pointer={currentStep > 3} on:click={() => currentStep >= 3 ? currentStep = 3 : currentStep}> 
	<div class="collapse-title text-xl font-medium">
	  Allergies et/ou régime
	</div> 
	<div class="collapse-content"> 
  
<p>Le cas échéant, merci de nous indiquer vos eventuelles allergies et/ou régime alimentaire.</p>



  <form on:submit|preventDefault={pushFamilyData}>
  {#each formValues.peopleByFamilyId.nodes as person,i}
	{#if person.attending}

  <div class="form-control my-2">
	<label for="" class="label">
	  <span class="label-text">Pour {person.firstName} {person.lastName}</span>
	</label> 
	<textarea rows="2" class="textarea h-12 textarea-bordered textarea-secondary" placeholder="Exemple : {person.firstName} est allergique à la viande de mammouth" bind:value={person.foodRemarks}></textarea>
  </div> 

  {/if}
  {/each}




  
  
  <button type="submit" class="btn btn-primary float-right" class:loading={loading}>Valider</button>
</form>
  </div>
  </div>

<!-- END TAB 3 / ALLERGIES -->
  
<!-- BEGIN TAB 4 / CONTACT -->
  
  <div tabindex="0" id="divstep-4" class="collapse border rounded-box border-base-300 collapse-close m-2 shadow-lg bg-base-100" class:bg-accent={currentStep > 4} class:collapse-open={currentStep === 4} class:collapse-close={currentStep !== 4} class:cursor-pointer={currentStep > 4} on:click={() => currentStep >= 4 ? currentStep = 4 : currentStep}> 
	<div class="collapse-title text-xl font-medium">
	  Contacts <small>pour vous prévenir des aléas éventuels</small>
	</div> 
	<div class="collapse-content"> 

		<form on:submit|preventDefault={pushFamilyData}>
  <div class="form-control my-2">
	<label class="label" for="emailinput">
	  <span class="label-text">Adresse e-mail</span>
	</label> 
	<input type="text" placeholder="nom@domaine.com" id="emailinput" class="input input-primary input-bordered" bind:value={formValues.emailAddress} pattern="[^@\s]+@[^@\s]+\.[^@\s]+">
  </div> 
  
  <div class="intl-tel-wrapper">
	<label class="label" for="phoneinput">
	  <span class="label-text">Numéro de téléphone</span>
   </label> 
  
  <div class="form-control">
  
	<input type="tel" id="phoneinput" class="input input-primary input-bordered">
  </div> 
</div>
  
  <!-- bind:value={formValues.phone}  -->
  
  
  <button type="submit" class="btn btn-primary float-right" class:loading={loading}>Valider</button>
  </form>
	</div>
	</div>

<!-- END TAB 4 / CONTACT -->
  
<!-- BEGIN TAB 5 / TEMPlogement -->
  
<div tabindex="0" id="divstep-5" class="collapse border rounded-box border-base-300 collapse-close m-2 shadow-lg bg-base-100" class:bg-accent={currentStep > 5} class:collapse-open={currentStep === 5} class:collapse-close={currentStep !== 5} class:cursor-pointer={currentStep > 5} on:click={() => currentStep >= 5 ? currentStep = 5 : currentStep}> 
	<div class="collapse-title text-xl font-medium">
	  Logement
	</div> 
	<div class="collapse-content"> 

<!-- popin confirmation que la personne ne vient pas -->
<input type="checkbox" id="my-modal-5" class="modal-toggle" bind:checked={displayStep5Popin}> 
<div class="modal">
  <div class="modal-box">
	<p>Vous n'avez pas accepté tous les logements, êtes vous certains ? <br/>
		- si vous n'avez pas choisi, vous pourrez revenir ici plus tard pour modifier votre choix. <br/>
		- si vous avez refusé, c'est définitif</p> 
	<div class="modal-action">
	  <label for="my-modal-5" class="btn btn-primary" on:click={() => pushFamilyData(false)}>Oui, je suis certain</label> 
	  <label for="my-modal-5" class="btn">Non, attends !</label>
	</div>
  </div>
</div>

		


		<form on:submit|preventDefault={() => pushFamilyData(true)}>


			

			{#if formValues.bookingsByFamilyId.nodes.length > 0}

			<p>Nous avons le plaisir de vous proposer ces logements dans le domaine du château:</p>
			{#if displayDayOfArrival}
			<label class="label" for="">
				<span class="label-text">...et vous avez la possiblité d'arriver dès vendredi 19 août et donc de rester pour 2 nuits, précisez-le ci-dessous :</span>
					</label>
			<select class="select select-bordered select-sm select-primary" bind:value={formValues.dayOfArrival}> 
				<option value="vendredi">J'arrive vendredi</option> 
				<option value="samedi">J'arrive samedi</option>
			  </select> 
			{/if}

			{#each formValues.bookingsByFamilyId.nodes as booking,i}






			<fieldset class="flex flex-row flex-wrap border-2 border-base-100 rounded-box shadow-md p-2 my-4 relative">


				<legend><strong>Batiment:</strong> {booking.roomByRoomId.buildingName} / <strong>Etage:</strong> {booking.roomByRoomId.etage}</legend>

				<ul class="list-disc list-inside text-sm">
					<li>
						<strong>Catégorie: </strong>{booking.roomByRoomId.categoryDescription}
					</li>
					<li>
						<strong>Equipement: </strong>{booking.roomByRoomId.equipement}
					</li>
					<li>
						<strong>Capacité: </strong>{booking.roomByRoomId.capacity} personne(s)
					</li>
					<li>
						<strong>Taille des lits: </strong>{booking.roomByRoomId.bedsizes}
					</li>

				</ul>
				
	
			<select class="select select-bordered select-sm w-full max-w-xs select-primary" bind:value={booking.bookingState}>
			  <option value="pending" disabled>Votre réponse ici :</option> 
			  <option value="accepted" >J'accepte</option> 
			  <option value="refused" >Je refuse</option>
			</select> 
			
			
			</fieldset>
			{/each}




			{:else}

			Vous pourrez retrouver les hôtels aux environs via le menu
			{/if}
  

			{#if formValues.bookingsByFamilyId.nodes.filter(arg => arg.bookingState == "accepted").length == formValues.bookingsByFamilyId.nodes.length && formValues.bookingsByFamilyId.nodes.length > 0}
				

			<p>Nous vous proposons des lits supplémentaires (s'il en reste) :</p>
				
				{#each toolsArray as tool, i}
				{#if tool.toolType == "bed"}

				

				<fieldset class="border-2 border-base-100 rounded-box shadow-md p-2 my-4 relative">

					<legend>{tool.toolName} <small>(il en reste {tool.remaining})</small></legend>
				
				
					<div class="flex flex-row w-32">
						<label for="" class="btn btn-primary btn-sm" class:loading={delLoading == i} on:click={() => delOneToolBis(i)}>enlever</label>
						<div id="quantity" placeholder="1" class="input input-primary input-bordered input-sm">{formValues.toolBookingsByFamilyId.nodes.filter(arg => arg.bookingState != "open" && arg.toolByToolId.toolId == toolsArray[i].toolId).length}</div>
						<label for="" class="btn btn-primary btn-sm" class:loading={addLoading == i} on:click={() => getOneTool(i)}>ajouter</label>
			
					  </div>
					</fieldset>
				

				{/if}
				{/each}
				
			{/if}

			{#if formValues.bookingsByFamilyId.nodes.filter(arg => arg.bookingState == "accepted").length > 0}
				<p>Nous vous proposons des petits déjeuners du samedi matin :</p>
				
				{#each toolsArray as tool, i}
				{#if tool.toolType == "food"}

				

				<fieldset class="border-2 border-base-100 rounded-box shadow-md p-2 my-4 relative">

					<legend>{tool.toolName}</legend>
				
				
					<div class="flex flex-row w-32">
						<label for="" class="btn btn-primary btn-sm" class:loading={delLoading == i} on:click={() => delOneToolBis(i)}>enlever</label>
						<div id="quantity" placeholder="1" style="text-transform: uppercase" class="input input-primary input-bordered input-sm">{formValues.toolBookingsByFamilyId.nodes.filter(arg => arg.bookingState != "open" && arg.toolByToolId.toolId == toolsArray[i].toolId).length}</div>
						<label for="" class="btn btn-primary btn-sm" class:loading={addLoading == i} on:click={() => getOneTool(i)}>ajouter</label>
			
					  </div>
					</fieldset>
				

				{/if}
				{/each}
				
				
				

			{/if}




			{#if formValues.bookingsByFamilyId.nodes.filter(arg => arg.bookingState == "accepted").length > 0}
			<div class="alert my-2 alert-sm shadow-md bg-base-100">
				<div class="flex-1">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 mx-2 stroke-current">
					  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>                          
					</svg> 
					<label for="">Avec ces choix :
						<ul class="list-disc list-inside">
							<li>Nombre de chambres choisies : <strong>{formValues.bookingsByFamilyId.nodes.filter(arg => arg.bookingState == "accepted").length}</li>
						 <li>Vous logez théoriquement <strong>{capacityOptedFor + formValues.toolBookingsByFamilyId.nodes.filter(arg => arg.bookingState != "open" && arg.toolByToolId.toolType == "bed").length}</strong> des {attendingPeopleCount} personne(s) pour <strong>{daysText}</strong>.
						</li>

						{#if (capacityOptedFor + formValues.toolBookingsByFamilyId.nodes.filter(arg => arg.bookingState != "open" && arg.toolByToolId.toolType == "bed").length) < attendingPeopleCount}
						<div class="alert alert-success alert-sm shadow-md failure text-sm" role="alert">
							<div>
							  <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
							  <span>Attention, le nombre de couchages semble insuffisant, vous pouvez ajouter un ou des lits supplémentaires</span>
							</div>
						  </div>
						  {/if}

						<li>Vous avez pris <strong>{formValues.toolBookingsByFamilyId.nodes.filter(arg => arg.bookingState != "open" && arg.toolByToolId.toolType == "food").length}</strong> petit(s) déjeuner(s) du samedi.
						</li>
						
							
							
							{#if formValues.toolBookingsByFamilyId.nodes.filter(arg => arg.bookingState != "open" && arg.toolByToolId.toolType == "food").length > 0 && !formValues.freeBooking}
							<li>Le prix pour les petits déjeuners est de <strong>{formValues.toolBookingsByFamilyId.nodes.filter(arg => arg.bookingState != "open" && arg.toolByToolId.toolType == "food").length * 10} €</strong></li>
							{/if}

							{#if !formValues.freeBooking}
							<li>Le prix pour les chambres est de : <strong>{contribution} €</strong></li>
							<li>Le prix total est de : <strong>{contribution + formValues.toolBookingsByFamilyId.nodes.filter(arg => arg.bookingState != "open" && arg.toolByToolId.toolType == "food").length * 10} €</strong></li>
							{/if}

							<br/>Remarque: nous offrons aux personnes logées sur place un brunch dimanche.
					
						</ul>
						</label>
				  </div>
				</div>
			{/if}

  
  <button type="submit" class="btn btn-primary float-right" class:loading={loading}>Valider</button>
  </form>
	</div>
	</div>

<!-- END TAB 5 / LOGEMENT -->

<!-- TAB 6 / RECAP -->
<div tabindex="0" id="divstep-6" class="collapse border rounded-box border-base-300 collapse-close m-2 shadow-lg bg-base-100" class:bg-accent={currentStep > 6} class:collapse-open={currentStep === 6} class:collapse-close={currentStep !== 6}> 
	<div class="collapse-title text-xl font-medium">
	  Récapitulatif
	</div> 
	<div class="collapse-content"> 


<div class="alert alert-info my-2 alert-sm">
	<div class="flex-1">
	  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 mx-2 stroke-current">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>                          
	  </svg> 
	  <label for="">
		{#if formValues.cocktailAttending}
Vous venez au cocktail {#if formValues.dinerAttending}et au dîner{/if}
		{:else}
Vous ne pouvez pas venir :(
		{/if}
	  </label>
	</div>
</div>

{#if formValues.cocktailAttending}
Nous serons heureux de vous retrouver {dateArrivalText} août 2022 !
<img alt="" src="https://media.giphy.com/media/8Iv5lqKwKsZ2g/giphy.gif" />
{:else}
...mais vous pourrez voir les photos ulterieurement sur le site :)
{/if}




{#if formValues.bookingsByFamilyId.nodes.filter(arg => arg.bookingState == "accepted").length > 0}
			<div class="alert my-2 alert-sm shadow-md bg-base-100">
				<div class="flex-1">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 mx-2 stroke-current">
					  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>                          
					</svg> 
					<label for="">En ce qui concerne le logement :
						<ul class="list-disc list-inside">
							<li>Nombre de chambres choisies : <strong>{formValues.bookingsByFamilyId.nodes.filter(arg => arg.bookingState == "accepted").length}</li>
						 <li>Vous logez théoriquement <strong>{capacityOptedFor + formValues.toolBookingsByFamilyId.nodes.filter(arg => arg.bookingState != "open" && arg.toolByToolId.toolType == "bed").length}</strong> des {attendingPeopleCount} personne(s) pour <strong>{daysText}</strong>.
						</li>

						{#if (capacityOptedFor + formValues.toolBookingsByFamilyId.nodes.filter(arg => arg.bookingState != "open" && arg.toolByToolId.toolType == "bed").length) < attendingPeopleCount}
						<div class="alert alert-success alert-sm shadow-md failure text-sm" role="alert">
							<div>
							  <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
							  <span>Attention, le nombre de couchages semble insuffisant, vous pouvez ajouter un ou des lits supplémentaires en revenant à l'étape précédente</span>
							</div>
						  </div>
						  {/if}

						<li>Vous avez pris <strong>{formValues.toolBookingsByFamilyId.nodes.filter(arg => arg.bookingState != "open" && arg.toolByToolId.toolType == "food").length}</strong> petit(s) déjeuner(s) du samedi.
						</li>
						
							
							
							{#if formValues.toolBookingsByFamilyId.nodes.filter(arg => arg.bookingState != "open" && arg.toolByToolId.toolType == "food").length > 0 && !formValues.freeBooking}
							<li>Le prix pour les petits déjeuners est de <strong>{formValues.toolBookingsByFamilyId.nodes.filter(arg => arg.bookingState != "open" && arg.toolByToolId.toolType == "food").length * 10} €</strong></li>
							{/if}

							{#if !formValues.freeBooking}
							<li>Le prix pour les chambres est de : <strong>{contribution} €</strong></li>
							<li>Le prix total est de : <strong>{contribution + formValues.toolBookingsByFamilyId.nodes.filter(arg => arg.bookingState != "open" && arg.toolByToolId.toolType == "food").length * 10} €</strong></li>
							<div class="alert alert-success alert-sm shadow-md failure text-sm" role="alert">
								<div>
								  <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
								  <span>Merci de venir avec la somme en espèces dans une enveloppe sur laquelle vous devez inscrire votre nom et ce numéro de référence: 00{formValues.familyId}</span>
								</div>
							  </div>
							{/if}

							<br/>Remarque: nous offrons aux personnes logées sur place un brunch dimanche.
							<br/>{#if formValues.dayOfArrival == "vendredi"}
							Attention les repas du vendredi soir et du samedi midi ne sont pas prévus.
							{/if}
					
						</ul>
						</label>
				  </div>
				</div>
			{/if}



		<form on:submit|preventDefault={pushFamilyData}>
  
  <button type="submit" class="btn btn-primary float-right" class:loading={loading}>Je confirme</button>
  
  </form>
	</div>
	</div>
<!-- END TAB 6 / RECAP-->


</div> 

</div> <!--END CENTRAL CONTENT--> 



<style global lang="postcss">

	.persondelete{
		top: -12px;
		right: -1px;
	}
	.failure{
    background-color: rgb(230, 67, 26);
    color: #fff;
  }

.intl-tel-wrapper{
padding-bottom: 90px;
padding-top: 50px;
}

  </style>