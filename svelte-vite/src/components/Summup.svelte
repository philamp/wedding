<script>
import { connectionStatus, formValuesRoot } from '/src/store.js';
export let formValues;

let compTitle = "Avec les choix que vous venez d'effectuer"

if(formValues == null){
formValues = $formValuesRoot

compTitle = "Récapitulatif contribution"

}


let contribution = 0;

let capacityOptedFor = 0;

$: if(formValues.bookingsByFamilyId.nodes.length){
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

$: attendingPeopleCount = formValues.peopleByFamilyId.nodes.filter(arg => arg.attending).length

$: daysText = formValues.dayOfArrival == "vendredi" ? "2 nuits" : "1 nuit"

</script>

{#if formValues.bookingsByFamilyId.nodes.filter(arg => arg.bookingState == "accepted").length > 0}
			<div class="alert my-2 alert-sm shadow-md bg-base-100">
				<div class="flex-1">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 mx-2 stroke-current">
					  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>                          
					</svg> 
					<label for="">{compTitle} :
						<ul class="list-disc list-inside">
							<li>Nombre de chambres choisies : <strong>{formValues.bookingsByFamilyId.nodes.filter(arg => arg.bookingState == "accepted").length}</li>
						 <li>Vous logez théoriquement <strong>{capacityOptedFor + formValues.toolBookingsByFamilyId.nodes.filter(arg => arg.bookingState != "open" && arg.toolByToolId.toolType == "bed").length}</strong> des {attendingPeopleCount} personne(s) pour <strong>{daysText}</strong> (arrivée le {formValues.dayOfArrival}).
						</li>

						{#if (capacityOptedFor + formValues.toolBookingsByFamilyId.nodes.filter(arg => arg.bookingState != "open" && arg.toolByToolId.toolType == "bed").length) < attendingPeopleCount}
						<div class="alert alert-success alert-sm shadow-md failure text-sm" role="alert">
							<div>
							  <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
							  <span>Attention, le nombre de couchages semble insuffisant, vous pouvez ajouter des lits ou des chambres supplémentaires</span>
							</div>
						  </div>
						  {/if}

                          {#if formValues.toolBookingsByFamilyId.nodes.filter(arg => arg.bookingState != "open" && arg.toolByToolId.toolType == "food").length > 0}
						<li>Vous avez pris <strong>{formValues.toolBookingsByFamilyId.nodes.filter(arg => arg.bookingState != "open" && arg.toolByToolId.toolType == "food").length}</strong> petit(s) déjeuner(s) du samedi.
						</li>
                        {/if}
						
							
							
							{#if formValues.toolBookingsByFamilyId.nodes.filter(arg => arg.bookingState != "open" && arg.toolByToolId.toolType == "food").length > 0 && !formValues.freeBooking}
							<li>Le prix pour les petits déjeuners est de <strong>{formValues.toolBookingsByFamilyId.nodes.filter(arg => arg.bookingState != "open" && arg.toolByToolId.toolType == "food").length * 10} €</strong></li>
							{/if}

                            {#if formValues.toolBookingsByFamilyId.nodes.filter(arg => arg.bookingState != "open" && arg.toolByToolId.toolType == "bed").length > 0 }
                            <li>Vous avez pris {formValues.toolBookingsByFamilyId.nodes.filter(arg => arg.bookingState != "open" && arg.toolByToolId.toolName == "Lit parapluie").length} Lit(s) parapluie
                            et {formValues.toolBookingsByFamilyId.nodes.filter(arg => arg.bookingState != "open" && arg.toolByToolId.toolName == "Lit pliant").length} Lit(s) pliant (offert(s))</li>
                            {/if}

							{#if !formValues.freeBooking}
							<li>Le prix pour les chambres est de : <strong>{contribution} €</strong> (pour {daysText})</li>
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