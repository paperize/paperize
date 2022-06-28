import { Store, get, set, keys, clear } from 'idb-keyval'

const
  DATABASE_NAME = "Font Cache",
  STORE_NAME = "url-base64",
  FONT_STORE = new Store(DATABASE_NAME, STORE_NAME)

export const
  clearFontCache = () => {
    return clear(FONT_STORE)
  },

  fontCacheCount = () => {
    return Bluebird.resolve(keys(FONT_STORE)).get("length")
  },

  getCachedFont = function(key) {
    return get(key, FONT_STORE)
  },

  setCachedFont = function(key, value) {
    return set(key, value, FONT_STORE)
  }

export default {
  clearFontCache,
  clear: clearFontCache,
  fontCacheCount,
  count: fontCacheCount,
  getCachedFont,
  get: getCachedFont,
  setCachedFont,
  set: setCachedFont,
}
