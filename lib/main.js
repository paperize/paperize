// Quick detour to set up our shameful hacks
import './hacks'

// Configure Vue and start the app
import Vue from 'vue'

// in-memory store
import store from './store'

// long-term store
import storeSync from './services/store_sync'

// TODO: use this flag when testing
if(!import.meta.env.VITE_NO_SYNC) {
  // causes data to auto-load from Drive
  // and auto-save to Drive on change
  storeSync.initialize(store)
}

// routing
import router from './routes'
// Vuetify Material UI Framework
import vuetify from './vuetify'

// Vue extensions
import AsyncComputed from 'vue-async-computed'
Vue.use(AsyncComputed)

import VueObserveVisibility from 'vue-observe-visibility'
Vue.use(VueObserveVisibility)

// Top-Level app layout
import AppLayout from './components/layout/AppLayout.vue'

// When the window loads: go!
window.addEventListener('load', () => {
  // Top-level Vue component
  new Vue({
    router, store, vuetify,
    el: '#paperize-app',
    components: { AppLayout },
    // Render function instead of compiling templates in production
    render: h => h("app-layout")
  })
})
