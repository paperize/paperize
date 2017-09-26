if(process.env.NODE_ENV !== "production") {
  console.log("Paperize Editor:", process.env.NODE_ENV)
}

import Vue from 'vue'
import store from './store'
import persistence from './store/local_store_persistence'
import router from './routes'

import VModal from 'vue-js-modal'
Vue.use(VModal)

if(process.env.NODE_ENV == 'test') {
  Vue.config.productionTip = false
  Vue.config.devtools = false

  window.paperize = { store }
}

import TitleBar from './components/sitewide/TitleBar.vue'

let startApp = () => {
  // Top-level Vue component
  const app = new Vue({
    router, store,
    components: {
      "title-bar": TitleBar
    },
    // Render the TitleBar outside the router view
    render: (h) => { return h("div", [h("title-bar"), h("router-view")]); }
    // Mount it here in the index.html
  }).$mount('#paperize-app')
}

window.addEventListener('load', startApp)
