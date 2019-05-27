import uuid from 'uuid/v4'
import { generateCrud } from './util/vuex_resource'

const ErrorModel = {
  name: 'errors',

  create(newError) {
    return {
      id:               uuid(),
      name:             "",
      message:          "",
      // override with given
      ...newError
    }
  },

  getters: { },

  actions: { }
}

const ErrorModule = generateCrud(ErrorModel)

export default ErrorModule
