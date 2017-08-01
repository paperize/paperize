console.log("Loading Paperize Editor...")

import Vue from 'vue'
import store from './store'
import router from './routes'
import TitleBar from './components/TitleBar.vue'

if(process.env.NODE_ENV == 'test') {
  Vue.config.productionTip = false
  Vue.config.devtools = false
}

let startApp = () => {
  // Create an application
  const app = new Vue({
    router, store,
    components: {
      "title-bar": TitleBar
    },
    // Render the TitleBar outside the router view
    render: (h) => { return h("div", [h("title-bar"), h("router-view")]); }
    // Mount it here
  }).$mount('#paperize-app')
}

window.addEventListener('load', startApp)
