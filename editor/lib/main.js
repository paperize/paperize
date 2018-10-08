/* global process */
if(process.env.NODE_ENV !== "production") {
  console.log("Paperize Editor:", process.env.NODE_ENV)
}

import Vue from 'vue'
// in-memory store
import store from './store'
// long-term store
import persistence from './store/persistence'
persistence.initializeAndWatchStore(store)
// routing
import router from './routes'

// Vue extensions
import Vuetify from 'vuetify'
import colors from 'vuetify/es5/util/colors'
import 'vuetify/dist/vuetify.min.css'
Vue.use(Vuetify, {
  theme: {
    primary: colors.blueGrey.lighten2,
    secondary: colors.blueGrey.darken2,
    accent: colors.lime.accent3
  }
})

import Autocomplete from 'v-autocomplete'
Vue.use(Autocomplete)

import AsyncComputed from 'vue-async-computed'
Vue.use(AsyncComputed)

import VModal from 'vue-js-modal'
Vue.use(VModal, { dialog: true })

if(process.env.NODE_ENV == 'test') {
  Vue.config.productionTip = false
  Vue.config.devtools = false

  window.paperize = { store }
}

import AppLayout from './components/layout/AppLayout.vue'

let startApp = () => {
  // Top-level Vue component
  new Vue({
    router, store,
    el: '#paperize-app',
    components: {
      "app-layout": AppLayout
    },
    render: (h) => h("app-layout")
  })
}

window.addEventListener('load', startApp)
