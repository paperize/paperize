import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify)

// https://stackoverflow.com/questions/56393880/how-do-i-detect-dark-mode-using-javascript
const dark = window.matchMedia?.('(prefers-color-scheme: dark)').matches

export default new Vuetify({
  theme: { dark }
})
