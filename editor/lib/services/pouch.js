import PouchDB from 'pouchdb-core'

// All Environments
let configuredPouch = PouchDB
  .plugin(require('pouchdb-find').default)

if(process.env["NODE_ENV"] === 'test' && typeof window === 'undefined') {
  // Node tests, include extra libs for speed
  configuredPouch
    .plugin(require('pouchdb-adapter-memory').default)
  configuredPouch = configuredPouch.defaults({ adapter: 'memory' })
} else {
  // Any environment with a window
  configuredPouch
    .plugin(require('pouchdb-adapter-idb').default)
    .plugin(require('pouchdb-adapter-websql').default)
}

export default configuredPouch
