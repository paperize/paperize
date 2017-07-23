console.log("Loading Paperize Editor...")

import Vue from 'vue'
import Vuex from 'vuex'
import { router } from './routes'

if(process.env['NODE_ENV'] == 'test') {
  Vue.config.productionTip = false
  Vue.config.devtools = false
}

Vue.use(Vuex)

const store = new Vuex.Store({})

let startApp = () => {
  // Create an application
  const app = new Vue({
    router, store,
    // Simply render the router
    render: (h) => { return h("router-view"); }
    // Mount it here
  }).$mount('#paperize-app')
}

window.addEventListener('load', startApp)
