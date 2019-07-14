import { keys, pick, take } from 'lodash'
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
      id:               uuid(),
      name:             "",
      message:          "",
      details:          "",
      // override with given
      ...newError
    }
  },

  getters: {
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
        // choose 20 keys to keep at random TODO: make this right!
        const errorKeysToKeep = take(keys(state.errors), MAX_ERRORS_TO_KEEP)
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
