// LocalStore persistence layer for the vuex store
import store from './index'

const ID_TOKEN_KEY = 'id_token'
const DATABASE_KEY = 'persistence'

let api = {
  tokenToRecordId(idToken) {
    // parse the JWT for a globally unique user id
    // return jwtDecode(idToken).sub
    // no transform
    return idToken
  },

  getLocalDB() {
    return JSON.parse(localStorage.getItem(DATABASE_KEY)) || {}
  },

  setLocalDB(localDB) {
    localStorage.setItem(DATABASE_KEY, JSON.stringify(localDB))
  },

  loadIdToken() {
    // fetch the JWT from storage
    return localStorage.getItem(ID_TOKEN_KEY)
  },

  loadRecordId() {
    return this.tokenToRecordId(this.loadToken())
  },

  loadUser(idToken) {
    return this.loadPersisted("user", idToken)
  },

  loadGames(idToken) {
    return this.loadPersisted("games", idToken)
  },

  loadSources(idToken) {
    return this.loadPersisted("sources", idToken)
  },

  loadPersisted(recordName, idToken) {
    // get a record ID
    let recordId = this.tokenToRecordId(idToken)
    // load the entire database
    let localDB = this.getLocalDB()
    // look up this record by name under the id
    let record = localDB[recordId] && localDB[recordId][recordName] || null

    return record
  },

  saveState(state) {
    let { user, games, sources } = state
    if(!user.idToken) {
      localStorage.removeItem(ID_TOKEN_KEY)
    } else {
      games = games.games || []
      sources = sources.sources || []
      localStorage.setItem(ID_TOKEN_KEY, user.idToken)

      let recordId = this.tokenToRecordId(user.idToken)
      let localDB = this.getLocalDB()

      if(!localDB[recordId]) {
        localDB[recordId] = {}
      }

      localDB[recordId].user    = user
      localDB[recordId].games   = games
      localDB[recordId].sources = sources

      this.setLocalDB(localDB)
    }
  },

  loadStateFromDB(idToken) {
    let user = this.loadUser(idToken) || {}
    let games = this.loadGames(idToken) || []
    let sources = this.loadSources(idToken) || []

    store.commit("become", user)
    store.commit("setGames", games)
    store.commit("setSources", sources)
  }
}

// Load existing persisted state if present
let idToken = api.loadIdToken()

if(idToken) {
  api.loadStateFromDB(idToken)
}

// Start listening and persist on change
store.subscribe((mutation, state) => {
  api.saveState(state)
})

export default api
