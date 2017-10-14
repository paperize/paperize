// Bring in my weird factory cloning DSL
import { process, withinXofY, around } from './factory'

const DEFAULT_GAME = {
  id:          null,
  title:       "",
  coverArt:    "",
  playerCount: "",
  playTime:    "",
  ageRange:    "",
  components:  [ ]
}

const EX_BILL = {
  id: 1000,
  title: "Zuul 1000",
  coverArt: () => ``,
  playerCount: '2-5',
  playTime: () => `${around(30)} - ${around(90)} minutes`,
  ageRange: () => `${around(15)}+`,
  components: [
    { id: 1, type: "deck", title: "Legends", data: {
      layers: [], card_data: [], mapping: {}
    } },
    { id: 2, type: "deck", title: "Factions" },
    { id: 3, type: "deck", title: "Regions" }
  ]
}

export default {
  EX_BILL,

  factory (pattern) {
    // Clone the default model, then clone the selected pattern overtop
    let fabricant = { ...DEFAULT_GAME, ...pattern }
    // Process resulting prototype
    return process(fabricant)
  }
}
