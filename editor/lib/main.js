console.log("Loading Paperize Editor...")

import Vue from 'vue'

import { router } from './routes'

let startApp = () => {
  // Create an application
  const app = new Vue({
    router: router,
    // Simply render the router
    render: (h) => { return h("router-view"); }
    // Mount it here
  }).$mount('#paperize-app')
}

window.addEventListener('load', startApp)
