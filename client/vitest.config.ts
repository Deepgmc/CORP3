import { fileURLToPath } from 'node:url'

import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'
import { quasar } from '@quasar/vite-plugin'
//import { transformAssetUrls } from '@quasar/vite-plugin'

//import vue from '@vitejs/plugin-vue'

export default mergeConfig(
  viteConfig({mode: 'development', command: 'serve'}),
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
    },
    plugins: [
      // vue({
      //   template: { transformAssetUrls }
      // }),
      quasar({
        sassVariables: 'src/quasar-variables.sass'
      })
    ],
  }),
)

