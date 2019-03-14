import Vue from 'vue'
import { isEmpty, every } from 'lodash'
import { getCachedWorksheet, setCachedWorksheet } from '../services/sheet_cache'

const CacheModule = {
  state: {
    cache: {}
  },

  getters: {
    allSpreadsheetsCached: (_, getters) => ({ id: spreadsheetId, worksheets }) => {
      // are all of this sheet's worksheets cached here already?
      return !isEmpty(worksheets) && every(worksheets, ({ id }) => {
        return !!getters.sheetValues(spreadsheetId, id)
      })
    },

    cacheKey: () => (spreadsheetId, worksheetId) => {
      const key = `${spreadsheetId}-${worksheetId}`
      if(!spreadsheetId || !worksheetId) {
        throw new Error(`Bad cacheKey! "${key}"`)
      }
      return key
    },

    sheetValues: (state, getters) => (spreadsheetId, worksheetId) => {
      const key = getters.cacheKey(spreadsheetId, worksheetId)
      return state.cache[key]
    }
  },

  mutations: {
    cache(state, { key, values }) {
      Vue.set(state.cache, key, values)
    }
  },

  actions: {
    cacheSheet({ commit, getters }, { spreadsheetId, worksheets }) {
      return Promise.map(worksheets, ({ id, values = [] }) => {
        const key = getters.cacheKey(spreadsheetId, id)
        // we have our key and values
        // cache here in the store
        commit("cache", { key, values } )
        // cache in IDB
        return setCachedWorksheet(key, values)
      })
    },

    loadIDBCache({ commit, getters }, { id: spreadsheetId, worksheets }) {
      return !isEmpty(worksheets) && Promise.map(worksheets, ({ id }) => {
        const key = getters.cacheKey(spreadsheetId, id)

        return getCachedWorksheet(key)
          .then((values) => {
            commit("cache", { key, values })
          })
      })
    }
  }
}

export default CacheModule
