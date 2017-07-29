// LocalStore persistence layer for the vuex store
import jwtDecode from 'jwt-decode'

const ID_TOKEN_KEY = 'id_token'
const DATABASE_KEY = 'persistence'

export default {
  tokenToRecordId: function(idToken) {
    // parse the JWT for a globally unique user id
    return jwtDecode(idToken).sub
  },

  getLocalDB: function() {
    return JSON.parse(localStorage.getItem(DATABASE_KEY)) || {}
  },

  setLocalDB: function(localDB) {
    localStorage.setItem(DATABASE_KEY, JSON.stringify(localDB))
  },

  loadToken: function() {
    // fetch the JWT from storage
    let token = localStorage.getItem(ID_TOKEN_KEY)

    return token
  },

  loadProfile: function(idToken) {
    return this.loadPersisted("profile", idToken)
  },

  loadGames: function(idToken) {
    return this.loadPersisted("games", idToken)
  },

  loadPersisted: function(recordName, idToken) {
    // get a record ID
    let recordId = this.tokenToRecordId(idToken)
    // load the entire database
    let localDB = this.getLocalDB()
    // look up this record by name under the id
    let record = localDB[recordId] && localDB[recordId][recordName] || null

    return record
  },

  saveState: function({ idToken, profile, games }) {
    if(!idToken) {
      localStorage.removeItem(ID_TOKEN_KEY)
    } else {
      localStorage.setItem(ID_TOKEN_KEY, idToken)

      let recordId = this.tokenToRecordId(idToken)
      let localDB = this.getLocalDB()

      if(!localDB[recordId]) {
        localDB[recordId] = {}
      }

      localDB[recordId].profile = profile
      localDB[recordId].games = games

      this.setLocalDB(localDB)
    }
  }
}
