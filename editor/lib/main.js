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

import TitleBar from './components/sitewide/TitleBar.vue'

let startApp = () => {
  // Top-level Vue component
  new Vue({
    router, store,
    components: {
      "title-bar": TitleBar
    },
    // Render the TitleBar outside the router view
    render: (h) => h("div", [h("title-bar"), h("router-view"), h("v-dialog")])
    // Mount it here in the index.html
  }).$mount('#paperize-app')
}

window.addEventListener('load', startApp)
