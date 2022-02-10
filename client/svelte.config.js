import adapter from '@sveltejs/adapter-auto'
import preprocess from 'svelte-preprocess'
import path from 'path'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    adapter: adapter(),

    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',

    // Override http methods in the Todo forms
    methodOverride: {
      allowed: ['PATCH', 'DELETE'],
    },

    vite: {
      resolve: {
        alias: {
          $utils: path.resolve('./src/utils'),
          $stores: path.resolve('./src/stores'),
          $assets: path.resolve('./src/assets'),
          $artifacts: path.resolve('./src/artifacts'),
          $contracts: path.resolve('./src/contracts'),
        },
      },
    },
  },
}

export default config
