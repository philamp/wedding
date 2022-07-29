<script>

	import { onMount } from 'svelte';
	import { push } from 'svelte-spa-router';
	import Login from '/src/components/Login.svelte';
	//spa router params
	export let params = {}
	let logincomp;
	let QRValueSvelte;
onMount(() => {

	//auth with cookie is done in app with component Login

	//auth with URL  with component Login
	if(params.urlQrCode){
		QRValueSvelte = params.urlQrCode;
		logincomp.auth(QRValueSvelte) // and then fmdata() is called inside component by auth()
	}


	if(params.redirectA && params.redirectB){
		push("/"+params.redirectA+"/"+params.redirectB)
	}

})
</script>
<Login bind:this={logincomp} />
