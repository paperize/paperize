import emitter from 'event-emitter'
import Promise from 'bluebird'
import axios from 'axios'

let api = axios.create({
  baseURL: "https://tshhjsj74g.execute-api.us-east-1.amazonaws.com/staging/",
  headers: {
    Authorization: "allow"
  }
})

let dummyGame = {
  id: 1000,
  title: "Zuul 1000",
  coverArt: 'http://www.fillmurray.com/200/100',
  players: '2-5',
  playTime: '30-90 minutes',
  ages: '8+',
  components: [
    { id: 1, type: "deck", title: "Legends", data: {
      layers: [], card_data: [], mapping: {}
    } },
    { id: 2, type: "deck", title: "Factions" },
    { id: 3, type: "deck", title: "Regions" }
  ]

}

export default {
  create: (gameAttributes) => {
    console.log(gameAttributes)
    api.post("/games", gameAttributes)

    .then((response) => {
      console.log("new game response:", response.data)
    })
  },

  find: (gameId) => {
    console.log("finding", gameId)

    let findPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve(dummyGame)
      }, 500)
    })

    return findPromise
  },

  mostRecent: () => {
    let gameFetcher = emitter({})

    api.get("/games")

    .then((response) => {
      console.log("Response:", response)
      gameFetcher.emit("data", response.data)
    })

    return gameFetcher
  }
}
