import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import Home from './Home.vue'
import GameEditor from './GameEditor.vue'

const routes = [
  { path: '/',          component: Home, props: true },
  { path: '/games/:gameId', component: GameEditor, props: true }
]

var router = new VueRouter({ routes })

export { router }
