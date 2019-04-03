// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import Layout from '~/layouts/Default.vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

export default function (Vue, { router, head, isClient }) {
  // Install Vuetify
  Vue.use(Vuetify)
  head.link.push({
    rel: 'stylesheet',
    href: "https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons"
  })

  // Register global components
  Vue.component('Layout', Layout)
}
