/*import App from './App.svelte'

--const app
--export default app

window.onload = () => {
  const app = new App({
    target: document.getElementById("svelteContainer")
  })
  
}
*/


import App from './App.svelte'

const app = new App({
  target: document.getElementById("svelteContainer"),
  props: {
		ready: false,
	}
})

window.initMap = function ready() {
	app.$set({ ready: true });
}

export default app
