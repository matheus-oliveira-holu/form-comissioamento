import './assets/main.css'
import { createApp, reactive } from 'vue'
import App from './App.vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import VMask from 'v-mask'

const vuetify = createVuetify({
  components,
  directives,
})

const globalVariable = {
  data(){
    return{
      valuesForm: reactive({})
    }
  }
}
const app = createApp(App).use(vuetify)
app.mixin(globalVariable)
app.mount('#app')



