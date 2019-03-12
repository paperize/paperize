import Vue from 'vue'
import { isEmpty, every } from 'lodash'
import { getCachedWorksheet, setCachedWorksheet } from '../services/sheet_cache'

const CacheModule = {
  state: {
    cache: {}
  },

  getters: {
    allSheetsCached: (_, getters) => ({ id: sheetId, worksheets }) => {
      // are all of this sheet's worksheets cached here already?
      return !isEmpty(worksheets) && every(worksheets, ({ id }) => {
        return !!getters.sheetValues(sheetId, id)
      })
    },

    cacheKey: () => (sheetId, worksheetId) => {
      return `${sheetId}-${worksheetId}`
    },

    sheetValues: (state, getters) => (sheetId, worksheetId) => {
      const key = getters.cacheKey(sheetId, worksheetId)
      return state.cache[key]
    }
  },

  mutations: {
    cache(state, { key, values }) {
      Vue.set(state.cache, key, values)
    }
  },

  actions: {
    cacheSheet({ commit, getters }, { sheetId, worksheets }) {
      return Promise.map(worksheets, ({ id, values = [] }) => {
        const key = getters.cacheKey(sheetId, id)
        // we have our key and values
        // cache here in the store
        commit("cache", { key, values } )
        // cache in IDB
        return setCachedWorksheet(key, values)
      })
    },

    loadIDBCache({ commit, getters }, { id: sheetId, worksheets }) {
      return !isEmpty(worksheets) && Promise.map(worksheets, ({ id }) => {
        const key = getters.cacheKey(sheetId, id)

        return getCachedWorksheet(key)
          .then((values) => {
            commit("cache", { key, values })
          })
      })
    }
  }
}

export default CacheModule
