import { map, pick, reverse, sortBy, take, values } from 'lodash'
import uuid from 'uuid/v4'

import { generateCrud } from './util/vuex_resource'

const MAX_ERRORS_TO_KEEP = 20

const ErrorModel = {
  name: 'errors',

  state: {
    unreadErrorCount: 0
  },

  create(newError) {
    return {
      id:        uuid(),
      name:      "",
      message:   "",
      details:   "",
      createdAt: Date.now(),
      // override with given
      ...newError
    }
  },

  getters: {
    // Override to fetch in reverse chronological by creation time
    allErrors: state => reverse(sortBy(values(state.errors), "createdAt")),
    errorCount: (_, getters) => getters.allErrors.length,
    unreadErrorCount: state => state.unreadErrorCount
  },

  mutations: {
    incrementUnreadErrorCount(state) {
      state.unreadErrorCount += 1
    },

    setUnreadErrorCount(state, newCount) {
      state.unreadErrorCount = newCount
    },

    clearUnreadErrorCount(state) {
      state.unreadErrorCount = 0
    }
  },

  actions: {
    clearUnreadErrors({ commit }) {
      commit("clearUnreadErrorCount")
    },

    truncateErrors({ state, commit, getters }) {
      if(getters.errorCount > MAX_ERRORS_TO_KEEP) {
        const errorKeysToKeep = map(take(getters.allErrors, MAX_ERRORS_TO_KEEP), "id")
        commit("setErrors", pick(state.errors, errorKeysToKeep))
        commit("setUnreadErrorCount", MAX_ERRORS_TO_KEEP)
      }
    }
  },

  // proto callbacks, kind of nasty
  subscribe({ dispatch, commit }, { type }) {
    if(type === 'createError') {
      commit("incrementUnreadErrorCount")
      dispatch("truncateErrors")
    }
  }
}

const ErrorModule = generateCrud(ErrorModel)

export default ErrorModule
