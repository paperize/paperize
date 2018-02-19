import { find } from 'lodash'
import uuid from 'uuid/v4'

import { generateCrud } from './vuex_resource'

const ComponentModel = {
  name: 'components',

  relationships: [
    { relation: 'hasOne', model: 'template', initialize: true, dependent: true },
    { relation: 'hasOne', model: 'source' }
  ],

  create(componentObject) {
    return {
      id:         uuid(),
      title:      "",
      sourceId:   null,
      templateId: null
    }
  },

  getters: {
    findComponentTemplate: (_, __, ___, rootGetters) => component => {
      if(component.templateId) {
        return rootGetters.findTemplate(component.templateId)
      }
    },

    findComponentSource: (_, __, ___, rootGetters) => component => {
      if(component.sourceId) {
        return rootGetters.findSource(component.sourceId)
      }
    },

    getComponentItems: (state, getters) => component => {
      const componentSource = getters.findComponentSource(component)
      if(!componentSource) {
        return []
      } else {
        return getters.getSourceItems(componentSource)
      }
    }
  },

  actions: {
    linkComponentSource({ commit }, { component, source }) {
      commit("updateComponent", { ...component, sourceId: source.id })
    },

    unlinkComponentSource({ commit }, component) {
      commit("updateComponent", { ...component, sourceId: null })
    }
  }
}

const ComponentsModule = generateCrud(ComponentModel)

export default ComponentsModule
