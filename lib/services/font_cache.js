import { Store, get, set } from 'idb-keyval'

const
  DATABASE_NAME = "Font Cache",
  STORE_NAME = "url-base64",
  IMAGE_STORE = new Store(DATABASE_NAME, STORE_NAME)

export const
  getCachedFont = function(key) {
    return get(key, IMAGE_STORE)
  },

  setCachedFont = function(key, value) {
    return set(key, value, IMAGE_STORE)
  }
