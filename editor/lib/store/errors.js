import { keys, pick, take } from 'lodash'
import uuid from 'uuid/v4'

import { generateCrud } from './util/vuex_resource'

const MAX_ERRORS_TO_KEEP = 20

const ErrorModel = {
  name: 'errors',

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

  getters: { },

  actions: {
    truncateErrors({ state, commit, getters }) {
      if(getters.allErrors.length > MAX_ERRORS_TO_KEEP) {
        // choose 20 keys to keep at random TODO: make this right!
        const errorKeysToKeep = take(keys(state.errors), MAX_ERRORS_TO_KEEP)
        commit("setErrors", pick(state.errors, errorKeysToKeep))
      }
    }
  },

  // proto callbacks, kind of nasty
  subscribe({ dispatch }, { type }) {
    if(type === 'createError') {
      dispatch("truncateErrors")
    }
  }
}

const ErrorModule = generateCrud(ErrorModel)

export default ErrorModule
