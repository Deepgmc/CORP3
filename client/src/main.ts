import 'quasar/src/css/index.sass'
import '@quasar/extras/material-icons/material-icons.css'
import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar } from 'quasar'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.config.errorHandler = function (err: any) {
    console.log('%c Global erorr handler:', 'background:rgb(85, 0, 0); color: #bada55; padding: 4px; font-size:11px');
    console.log(err)
}

app
.use(createPinia())
.use(router)
.use(Quasar, {
    plugins: {},
})
.mount('#corp_root_container')
