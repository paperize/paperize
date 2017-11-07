// TODO: webpack custom loader (read below...)
// The idea here is to only include the PouchDB baggage in environments that
// use it. Cypress tests don't use it, so I don't want to require it.
// Unfortunately, Webpack is still building in this environment, so I may
// need to actually toy with custom Loaders to do it right.


let pouchPersistence = {
  initializeAndWatchStore(store) {
    console.log("No persistence layer.")
    store.subscribe(({ type }, state) => {
      if(type === "become") {
        store.dispatch("setStoreReady")
      }
    })
  }
}
// Any environment except Cypress, load persistence layer
if(process.env["NODE_ENV"] !== 'test' ||
  (process.env["NODE_ENV"] === 'test' && typeof window === 'undefined')) {
  pouchPersistence = require('./pouch_persistence').default
}

export default pouchPersistence
