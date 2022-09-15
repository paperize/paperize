import { Store, get, set, keys, clear } from 'idb-keyval'

const
  DATABASE_NAME = "Font Cache",
  STORE_NAME = "url-base64",
  FONT_STORE = new Store(DATABASE_NAME, STORE_NAME)

export const
  clearFontCache = () => {
    return clear(FONT_STORE)
  },

  fontCacheCount = async () => {
    return (await keys(FONT_STORE)).length
  },

  getCachedFont = key => {
    return get(key, FONT_STORE)
  },

  setCachedFont = (key, value) => {
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
