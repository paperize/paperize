import { Store, get, set, keys, clear } from 'idb-keyval'

const
  DATABASE_NAME = "Image Cache",
  STORE_NAME = "md5-dataURL",
  IMAGE_STORE = new Store(DATABASE_NAME, STORE_NAME)

export const
  clearImageCache = () => {
    return clear(IMAGE_STORE)
  },

  imageCacheCount = () => {
    return Promise.resolve(keys(IMAGE_STORE)).get("length")
  },

  getCachedImage = (key) => {
    return get(key, IMAGE_STORE)
  },

  setCachedImage = (key, value) => {
    return set(key, value, IMAGE_STORE)
  }

export default {
  clearImageCache,
  clear: clearImageCache,
  imageCacheCount,
  count: imageCacheCount,
  getCachedImage,
  get: getCachedImage,
  setCachedImage,
  set: setCachedImage,
}
