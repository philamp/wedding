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
  target: document.getElementById("svelteContainer")
})

export default app
