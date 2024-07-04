import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import VueTheMask from 'vue-the-mask';
import { currencyMaskDirective } from './currencyMaskDirective';
import { createPinia } from "pinia"
// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'


const vuetify = createVuetify({
  components,
  directives,
})
const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.use(vuetify)
app.use(VueTheMask)
app.directive('currency-mask', currencyMaskDirective)
app.mount('#app')



