import { pick } from 'lodash'
import { generateCrud } from './util/vuex_resource'

const SheetModel = {
  name: 'sheets',

  create(newSheet) {
    return {
      ...pick(newSheet, [
        "id",
        "name",
        "parents"
      ]),

      refreshedAt: Date.now()
    }
  },

  getters: { },

  mutations: { },

  actions: { }
}

const SheetsModule = generateCrud(SheetModel)

export default SheetsModule
