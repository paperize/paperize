import { includes } from 'lodash'

// import { detectLocalDatabase } from 'services/detectors/database'
// import { detectGoogleLogin } from 'services/detectors/login'

let _store, _router

const
  EMPTY_MODE = "empty",
  LOADING_MODE = "loading",
  ERROR_MODE = "error",
  ACTIVE_MODE = "active",
  SYNC_MODE = "sync",
  MODES = [ EMPTY_MODE, ACTIVE_MODE, SYNC_MODE ],

  initialize = ({ store, router }) => {
    if(!store) { throw new Error(`Must initialize with a store!`) }
    if(!router) { throw new Error(`Must initialize with a router!`) }

    _store = store
    _router = router

    // set into "empty" mode
    setMode(EMPTY_MODE)
  },

  setMode = (mode) => {
    if(!includes(MODES, mode)) { throw new Error(`Unknown mode: ${mode}`) }

    switch(mode) {
    case EMPTY_MODE:
      _router.setEmptyMode()
      _store.dispatch("clearDatabase")
      _store.dispatch("setAppMode", "empty")
      break
    case ACTIVE_MODE:
      _router.setActiveMode(); break
    default:
      throw new Error(`Unhandled mode: ${mode}`)
    }
  },

  autoload = () => {
    // check for local db

    // check for logged-in

  }

export default { initialize, autoload }
