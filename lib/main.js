if(process.env.NODE_ENV !== "production") {
  console.log("Paperize Editor:", process.env.NODE_ENV)
}

import Vue from 'vue'
// in-memory store
import store from './store'
// long-term store
import storeSync from './services/store_sync'
// This comes from the webpack variables
if(!process.env.NO_SYNC) {
  storeSync.initialize(store)
}
// routing
import router from './routes'

// Vue extensions
import Vuetify from 'vuetify'
import colors from 'vuetify/es5/util/colors'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'
// import '@mdi/js'
Vue.use(Vuetify, {
  theme: {
    primary: colors.blueGrey.lighten2,
    secondary: colors.blueGrey.darken2,
  },
  iconfont: 'mdi'
})



import AsyncComputed from 'vue-async-computed'
Vue.use(AsyncComputed)

import VueObserveVisibility from 'vue-observe-visibility'
Vue.use(VueObserveVisibility)

// test-specific settings and globals
if(process.env.NODE_ENV !== 'production') {
  window.paperize = { store }
}

// Top-Level app layout
import AppLayout from './components/layout/AppLayout.vue'

// When the window loads: go!
window.addEventListener('load', () => {
  // Top-level Vue component
  new Vue({
    router, store,
    el: '#paperize-app',
    components: { AppLayout },
    // Render function instead of compiling templates in production
    render: (h) => h("app-layout")
  })
})
