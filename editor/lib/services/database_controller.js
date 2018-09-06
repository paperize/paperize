import store from '../store'

let api = {
  // Reset the entire state except for the user
  // Keeps us logged in but deletes all game data
  clear() {
    let userState = store.state.user
    store.commit("resetState", { user: userState })
  }
}

export default api
