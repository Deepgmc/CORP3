import 'quasar/src/css/index.sass'
import '@quasar/extras/material-icons/material-icons.css'
import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import VueApexCharts from 'vue3-apexcharts'
import { Quasar, Notify } from 'quasar'
import langRu from 'quasar/lang/ru'
import markerDirective from './directives/marker'
import splitNumber from './directives/splitNumber'

const app = createApp(App)

app.directive(markerDirective.name, markerDirective.fn)
app.directive('splitNumber', splitNumber)

app
    .use(router)
    .use(createPinia())
    .use(Quasar, {
        plugins: {Notify},
        lang: langRu
    })
    .use(VueApexCharts)

    .mount('#corp_root_container');




app.config.errorHandler = function (err: any) {
    console.log('%c Global erorr handler:', 'background:rgb(85, 0, 0); color: #bada55; padding: 4px;');
    console.log(err)
}
