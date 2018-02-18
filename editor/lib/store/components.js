import { find } from 'lodash'
import uuid from 'uuid/v4'

import { generateCrud } from './vuex_resource'

const ComponentModel = {
  name: 'components',

  relationships: [
    { relation: 'hasOne', model: 'template', initialize: true },
  ],

  create(componentObject) {
    return {
      id:         uuid(),
      title:      "",
      templateId: null
    }
  },

  getters: {
    findComponentTemplate: (_, __, ___, rootGetters) => component => {
      return rootGetters.findTemplate(component.templateId)
    },

    getComponentItems: (state, getters) => component => {
      if(!component.source) {
        return []
      } else {
        return getters.getSourceItems(component.source)
      }
    }
  }
}

const ComponentsModule = generateCrud(ComponentModel)

// setComponentSource({ state, commit, getters, rootGetters }, { component, source }) {
//   component = getters.findGameComponent(rootGetters.activeGame, component.id)
//   source = rootGetters.findSource(source)
//
//   commit("setComponentSource", { component, source })
// }

export default ComponentsModule
