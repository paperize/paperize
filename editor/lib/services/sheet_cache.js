import { Store, get, set } from 'idb-keyval'

const
  DATABASE_NAME = "Sheet Cache",
  STORE_NAME = "sheetId-worksheetId-values",
  IMAGE_STORE = new Store(DATABASE_NAME, STORE_NAME)

export const
  getCachedWorksheet = function(key) {
    return get(key, IMAGE_STORE)
  },

  setCachedWorksheet = function(key, value) {
    return set(key, value, IMAGE_STORE)
  }
