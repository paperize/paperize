import { Store, get, set, keys, clear } from 'idb-keyval'

const
  DATABASE_NAME = "Database Cache",
  STORE_NAME = "json",
  DB_STORE = new Store(DATABASE_NAME, STORE_NAME),
  DB_KEY = 'paperize_database.json'

export const
  clearDBCache = () => {
    return clear(DB_STORE)
  },

  dbCacheCount = async () => {
    return (await keys(DB_STORE)).length
  },

  getCachedDB = async () => {
    return get(DB_KEY, DB_STORE)
  },

  setCachedDB = value => {
    return set(DB_KEY, value, DB_STORE)
  }

export default {
  clearDBCache,
  clear: clearDBCache,
  dbCacheCount,
  count: dbCacheCount,
  getCachedDB,
  get: getCachedDB,
  setCachedDB,
  set: setCachedDB,
}
