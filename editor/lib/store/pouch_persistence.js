import Promise from 'bluebird'

import PouchDB from '../services/pouch'

const ID_TOKEN_KEY = 'id_token'
const STATE_KEY = 'state'

const IGNORED_MUTATIONS = [
  "resetState",
  "setLoginError",
  "setActiveGame",
  "clearActiveGame",
  "setActiveComponent",
  "clearActiveComponent",
  "setShowSpinner"
]

let api = {
  db: null,
  initializeAndWatchStore(store) {
    store.subscribe(({ type }, state) => {
      api.on(store, type, state)
    })

    // Load existing persisted state if present
    let idToken = api.getLocalStorage().getItem(ID_TOKEN_KEY)

    if(idToken) {
      store.dispatch("become", { idToken })
    }
  },

  getLocalStorage() {
    if(typeof localStorage === 'undefined') {
      return {
        setItem() { },
        getItem() { },
        removeItem() { }
      }
    } else {
      return localStorage
    }
  },

  openDatabase(dbName) {
    return new Promise((resolve, reject) => {
      // Close existing database and squelch error if it's not open
      this.closeDatabase().catch((error) => {
        if(error.message !== "database is closed") {
          throw error
        }
      })

      this.db = new PouchDB(dbName)
      resolve()
    })
  },

  closeDatabase() {
    if(this.db) {
      return this.db.close()
    } else {
      return Promise.resolve(null)
    }
  },

  lastSave: Promise.resolve(),
  saveState(stateObject) {
    // Bail if there's no user id in the state
    if(!(stateObject && stateObject.user && stateObject.user.idToken)) {
      // TODO: Proper validation
      return Promise.reject(new Error("State Object Invalid"))
    }

    this.lastSave = this.lastSave.then((lastRev) => {
      // Add the record ID and revision
      let record = { _id: STATE_KEY, _rev: lastRev, ...stateObject }

      return new Promise((resolve) => {
        return this.db.put(record)
          .then((response) => {
            resolve(response.rev)
          })
      }).catch({status: 409}, () => {
        console.error("PouchDB conflict saving record:", record)
      })
    })

    return this.lastSave
  },

  loadState() {
    // Wrap the Pouch promise in a bluebird promise for nicer catch
    return new Promise((resolve, reject) => {
      return this.db.get(STATE_KEY)
        .then((record) => {
          delete record._id
          // Remember the revision for the next save
          this.lastSave = Promise.resolve(record._rev)
          delete record._rev

          resolve(record)
        })
        .catch((error) => { reject(error) })
    }).catch({status: 404}, (error) => {
      return null
    })
  },

  on(store, type, state) {
    if(IGNORED_MUTATIONS.includes(type)) {
      return Promise.resolve(null)

    } else if(type === 'become') {
      // clear the rev
      this.lastSave = Promise.resolve(null)
      // this._rev = null
      // change databases
      return this.openDatabase(state.user.idToken).then(() => {
        // load up the state from the new database
        return this.loadState().then((loadedState) => {
          // only update state if we found a record
          if(loadedState) {
            // the given user might have new stuff
            loadedState.user.name      = state.user.name      || loadedState.user.name
            loadedState.user.avatarSrc = state.user.avatarSrc || loadedState.user.avatarSrc
            // foist it onto the store
            store.commit("resetState", loadedState)
            return null
          } else {
            // there's nothing in the db, so we actually need to persist now
            return this.saveState(state)
          }
        }).then(() => {
          store.dispatch("setStoreReady")
          // Once our database is copacetic, remember which db to open on refresh
          this.getLocalStorage().setItem(ID_TOKEN_KEY, state.user.idToken)
        })
      })

    } else if(type === 'logout') {
      this.getLocalStorage().removeItem(ID_TOKEN_KEY)
      return this.closeDatabase()

    } else {
      return this.saveState(state)
    }
  }
}



export default api
