import { Store, get, set } from 'idb-keyval'

const
  DATABASE_NAME = "Image Cache",
  STORE_NAME = "md5-dataURL",
  IMAGE_STORE = new Store(DATABASE_NAME, STORE_NAME)

export const
  getCachedImage = function(key) {
    return get(key, IMAGE_STORE)
  },

  setCachedImage = function(key, value) {
    return set(key, value, IMAGE_STORE)
  }
