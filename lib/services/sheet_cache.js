import { Store, get, set, keys, clear } from 'idb-keyval'

const
  DATABASE_NAME = "Sheet Cache",
  STORE_NAME = "spreadsheetId-worksheetId-values",
  SHEET_STORE = new Store(DATABASE_NAME, STORE_NAME)

export const
  clearWorksheetCache = () => {
    return clear(SHEET_STORE)
  },

  worksheetCacheCount = async () => {
    return (await keys(SHEET_STORE)).length
  },

  getCachedWorksheet = key => {
    return get(key, SHEET_STORE)
  },

  setCachedWorksheet = (key, value) => {
    return set(key, value, SHEET_STORE)
  }

export default {
  clearWorksheetCache,
  clear: clearWorksheetCache,
  worksheetCacheCount,
  count: worksheetCacheCount,
  getCachedWorksheet,
  get: getCachedWorksheet,
  setCachedWorksheet,
  set: setCachedWorksheet,
}
