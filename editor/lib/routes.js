import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import Splash from './Splash.vue'
import GameEditor from './GameEditor.vue'

const routes = [
  { path: '/',              component: Splash,     props: true },
  // { path: '/games',         component: GameIndex,  props: true },
  { path: '/games/:gameId', component: GameEditor, props: true }
]

var router = new VueRouter({ routes })

export { router }
