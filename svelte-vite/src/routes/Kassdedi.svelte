<script>


	import { onMount } from 'svelte';
	import { connectionStatus, formValuesRoot } from '/src/store.js';
	import {push} from 'svelte-spa-router';
	import Uppy from '@uppy/core'
import Dashboard from '@uppy/dashboard'
import AwsS3 from '@uppy/aws-s3'
import Webcam from '@uppy/webcam'
import French from '@uppy/locales/lib/fr_FR'

let htmlLoaded = false
let loading = false;

let currentStep = 1;

let formValues = $formValuesRoot

let returnedKey = "";


/*
let formValues = {
               "signing": "",
			   "signing": "",
            }
*/

	onMount(() => {

		document.querySelector('main').scrollTo(0, 0);

		htmlLoaded = true



	})

	async function pushFileData() {
		loading = true
		const res = await fetch('/api/pushfiledata', {
			method: 'POST',
			body: JSON.stringify(formValues),
			headers: {
    			'Accept': 'application/json',
    			'Content-Type': 'application/json'
			}
		
		})

		//push to store as well
		$formValuesRoot = formValues
		
		const json = await res.json()

		if(json.error){console.log(json.error);loading = false;return}

		loading = false
		if(currentStep == 2){
			currentStep = 3
		}

	}

	const bypass = () => {

		currentStep = 2
	}

	const objects = {}

	const loadUppy = () => {

		objects.uppy = new Uppy({
		//debug: true, 
		locale: French,
		restrictions: {
  			maxFileSize: 900000000,
  			maxNumberOfFiles: 1,
 			 minNumberOfFiles: 1,
  			allowedFileTypes: ['image/*', 'video/*']
			}
		})

		objects.uppy.on('upload-success', (file, data) => {
		formValues.signingImgUrl = file.meta.returnedKey // the S3 object key of the uploaded file
		  //console.log(returnedKey)
		  pushFileData()
		  objects.uppy.reset()
		  objects.uppy.getPlugin('Dashboard').closeModal()

		})

		objects.uppy.use(Webcam, {
				countdown: 3,
				showVideoSourceDropdown: true,
				videoConstraints: {
					facingMode: 'user',
					width: { min: 720, ideal: 1280, max: 1280 },
					height: { min: 480, ideal: 720, max: 720 },
				},
				showRecordingLength: true,
				preferredVideoMimeType: 'video/webm; codecs=vp9'
		})

		objects.uppy.use(Dashboard, {
			allowMultipleUploads: false,
		showLinkToFileUploadResult: true,
		showProgressDetails: true,
		fileManagerSelectionType: 'files',
		proudlyDisplayPoweredByUppy: false,
		plugins: ['Webcam'],
		inline: false,
		target: '#uppyContainer',
		note: 'Attention la photo ou la video doit faire moins de 900mo'
		})

		objects.uppy.use(AwsS3, {
		getUploadParameters (file) {
			loading = true
			// Send a request to our PHP signing endpoint.
			return fetch('/api/upload-signer', {
			method: 'post',
			// Send and receive JSON.
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json',
			},
			body: JSON.stringify({
				fileName: file.name,
				fileType: file.type,
			}),
			}).then((response) => {
			// Parse the JSON response.
			return response.json()
			}).then((data) => {
			// Return an object in the correct shape.
			return {
				url: data.signedUrl,
				method: 'PUT',
				fields: {returnedKey: data.returnedKey},
				headers: {'Content-type': data.fileType}
			}
			})
		},
		})

		

	} 

let fileType = ""
/*
const videoObjects = {}

function initPlayer() {

	videoObjects.player = new VideoPlayer({
          target: document.getElementById('playerContainer'),
          props: {
            source:
              'https://weddingmedias.s3.eu-west-3.amazonaws.com/'+formValues.signingImgUrl,
            controlsHeight: '55px',
            centerIconSize: '60px',
            color: 'deepskyblue',
			target: 'playerContainer'
          },
        });
      }
*/

const updateType = (imgurl) => {
	if(imgurl){
	let res = []
	res = imgurl.match(/\.[0-9a-z]{1,5}$/i)
	fileType = res[0]



	}
}

const prepareForm = () => {
	// set initial default values
	if(formValues.signingOnScreen == null){formValues.signingOnScreen = true}
	if(formValues.signingOnWeb == null){formValues.signingOnWeb = true}
}

const onConnectionStatusTrueAndHTMLLoaded = (cs,hl) => {
	if($connectionStatus && htmlLoaded){formValues = $formValuesRoot;prepareForm(); loadUppy();}
}

//on both criteria met, this is called when data comes from cookie auth and also on page change
$: onConnectionStatusTrueAndHTMLLoaded($connectionStatus, htmlLoaded);

$: updateType(formValues.signingImgUrl)
	
const openUModal = () => {
	objects.uppy.getPlugin('Dashboard').openModal()
}

$: if(currentStep != 4){
	setTimeout(() => {
		document.querySelector('#divstep-'+currentStep).scrollIntoView();
		document.querySelector('main').scrollBy(0,-100)
	}
	, 100)
}

</script>
<div id="central-content">

	<div id="formtabs" class="max-w-2xl" style="">

<div tabindex="0" id="divstep-1" class="collapse border rounded-box border-base-300 collapse-close m-2 bg-base-100 shadow-lg" class:bg-accent={currentStep > 1} class:collapse-open={currentStep === 1} class:collapse-close={currentStep !== 1} class:cursor-pointer={currentStep > 1} on:click={() => currentStep >= 1 ? currentStep = 1 : currentStep}> 
	<div class="collapse-title text-xl font-medium">
	  Ajouter une photo ou une video
	</div> 
	<div class="collapse-content"> 





		<div class="alert my-2 alert-sm shadow-md bg-base-100">
			<div class="flex-1">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 mx-2 stroke-current">
				  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>                          
				</svg> 
				<label for="">
					Nous vous proposons de nous laisser un souvenir en nous envoyant via ce formulaire une photo ou une video de vous. Si vous savez jouer d'un instrument, n'hésitez pas ! Vous pouvez aussi laisser un message écrit. <strong>Attention la video ne doit pas durer plus de 4 minutes</strong>.

					</label>
			  </div>
			</div>







		{#if formValues.signingImgUrl}
		<div class="form-control flex flex-row py-2">
			
			  <input type="checkbox" bind:checked={formValues.signingOnScreen} class="checkbox checkbox-secondary shrink-0">
			  <label for="" class="cursor-pointer w-3/4 px-2">
				
				J'accepte que ma photo ou vidéo soit affichée sur un écran dans le lieu de réception</label>
			
		  </div>

		  <div class="form-control flex flex-row py-2">

			  <input type="checkbox" bind:checked={formValues.signingOnWeb} class="checkbox checkbox-secondary shrink-0">
			  <label for="" class="cursor-pointer w-3/ px-2">
				
				J'accepte que ma photo ou vidéo soit affichée dans une section de ce site (accessible uniquement aux personnes identifiées)</label>
			
		  </div>


		Photo ou vidéo déja transférée:

		{#if fileType != '.webm' && fileType != '.mp4' && fileType != '.mov' && fileType != '.WEBM' && fileType != '.MP4' && fileType != '.MOV'}
			<img src="https://weddingmedias.s3.eu-west-3.amazonaws.com/{formValues.signingImgUrl}" class="rounded" title="" alt="" />
			{:else}
			<!-- svelte-ignore a11y-media-has-caption -->
			{#key formValues.signingImgUrl}
			<video controls>
				{#if fileType == '.webm' || fileType == '.WEBM'}
				<source src="https://weddingmedias.s3.eu-west-3.amazonaws.com/{formValues.signingImgUrl}"
						type="video/webm">
						{/if}
						{#if fileType == '.mp4' || fileType == '.mov' || fileType == '.MP4' || fileType == '.MOV'}
				<source src="https://weddingmedias.s3.eu-west-3.amazonaws.com/{formValues.signingImgUrl}"
						type="video/mp4">
						{/if}
			
				Sorry, your browser doesn't support embedded videos.
			</video>
			{/key}
			{/if}
		{/if}
		<div id="uppyContainer"></div>







		{#if !$connectionStatus}
		Vous devez être connecté pour accéder à ce formulaire : <a href="/#/P" title="" class="underline">me connecter</a>
		{:else}
		<button class="btn btn-primary" on:click={openUModal}>
			
				  Transferer un nouveau fichier ou se filmer avec la caméra
				
			</button> 

		<form on:submit|preventDefault={bypass}>
		<button type="submit" class="btn btn-primary float-right" class:loading={loading}>
			
		{#if formValues.signingImgUrl != null}	
			Valider
			{:else}
			Passer cette étape
		{/if}

		</button>
		</form>
		{/if}
  </div>
  </div>


  <div tabindex="0" id="divstep-2" class="collapse border rounded-box border-base-300 collapse-close m-2 bg-base-100 shadow-lg" class:bg-accent={currentStep > 2} class:collapse-open={currentStep === 2} class:collapse-close={currentStep !== 2} class:cursor-pointer={currentStep > 2} on:click={() => currentStep >= 2 ? currentStep = 2 : currentStep}> 
	<div class="collapse-title text-xl font-medium">
	  Ajouter un mot
	</div> 
	<div class="collapse-content"> 
  

  <form on:submit|preventDefault={pushFileData}>


  <div class="form-control my-2">
	<label for="" class="label">
	  <span class="label-text">Saisissez ci-dessous votre message :</span>
	</label> 
	<textarea rows="2" class="textarea h-36 textarea-bordered textarea-secondary" placeholder="Et effectivement, je sens que cette parenthèse n'est qu'une précision donnée au lecteur et que l'auteur va vouloir la refermer très rapidement. Alors je me précipite avec mon signe de ponctuation sous le bras, j'enjambe les quatre majuscules de la phrase, je manque trébucher sur les guillemets, je bouscule mon camarade et, in extremis, je plante ma parenthèse fermante" bind:value={formValues.signing}></textarea>
  </div> 


  
  
  <button type="submit" class="btn btn-primary float-right" class:loading={loading}>Valider</button>
</form>
  </div>
  </div>




  <div tabindex="0" id="divstep-3" class="collapse border rounded-box border-base-300 collapse-close m-2 bg-base-100 shadow-lg" class:bg-accent={currentStep > 3} class:collapse-open={currentStep === 3} class:collapse-close={currentStep !== 3} class:cursor-pointer={currentStep > 2} on:click={() => currentStep >= 3 ? currentStep = 3 : currentStep}> 
	<div class="collapse-title text-xl font-medium">
	  Merci !
	</div> 
	<div class="collapse-content"> 
		<img alt="" class="rounded" src="https://media.giphy.com/media/3oz8xIsloV7zOmt81G/giphy.gif" />

		<button class="btn btn-primary float-right" on:click={() => {push('/M/program')}}>
			
			Aller à la page <strong>&nbsp;Programme et accès</strong>
		  
	  </button> 
		

  </div>
  </div>




</div>

</div>

<style global lang="postcss">
	@import "@uppy/core/dist/style.min.css";
	@import "@uppy/dashboard/dist/style.min.css";
	@import '@uppy/webcam/dist/style.css';

</style>