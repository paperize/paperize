// Use the excellent Vue framework
import Vue from 'vue'

// Vue extensions
import Vuetify from 'vuetify'
import colors from 'vuetify/es5/util/colors'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'

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

// Top-Level App State Management
import store from './store'
import router from './routes'
import AppStateManager from './app_state_manager'

AppStateManager.initialize({ store, router })

if(process.env.NODE_ENV == "production") {
  AppStateManager.autoload()

} else {
  console.log("Paperize Editor:", process.env.NODE_ENV)
  // expose the internals for easy inspection in console and tests
  window.paperize = { store }
}

// Root Layout Component
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
