import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueDevTools(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
    /*build: {
        outDir: './dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                app: './index.html',
            },
        },
    },*/

    /*server: {
        open: true,
        //open: '/umbrella.html',
        //port: 5555,
        //disableHostCheck: true,
        watch: {
            usePolling: true
        },
        proxy: {
            '/auth': {
                target: `http://localhost:/${env.PROXY_DEV_PORT}`,
                changeOrigin: true,//заголовок Origin
                //rewrite: (path) => path.replace(/^\/api/, ''),
            },
            '/api': {
                target: `http://localhost:${env.PROXY_DEV_PORT}/`,
                changeOrigin: true,//заголовок Origin
                //rewrite: (path) => path.replace(/^\/api/, ''),
            },
        }
    },
    // css: {
    //     preprocessorOptions: {
    //         scss: {
    //             additionalData: `@use "@/assets/globalVariables.scss" as *;`
    //         }
    //     }
    // },*/
})
