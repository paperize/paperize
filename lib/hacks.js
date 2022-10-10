// Expose the store globally for tests to tie into
// TODO: use proper Vue/Vuex testing approach
import store from './store'
if(import.meta.env.DEV) {
  window.paperize = { store }
}

// Make a Bluebird global easy to grab where we use Promise.map/.each/.try etc
// TODO: move to async/await and remove Bluebird-isms from codebase
import Bluebird from 'bluebird'
window.Bluebird = Bluebird

// Hack for color-parse
// TODO: fix it and remove
window.global = window
