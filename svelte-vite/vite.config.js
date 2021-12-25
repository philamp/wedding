import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  server: {
    host: true,
    port: '8091',
    proxy : {
      '/api': 'http://localhost:3000',
      '/graphql': 'http://localhost:3000',
      '/graphiql': 'http://localhost:3000'
    }
  },

})

