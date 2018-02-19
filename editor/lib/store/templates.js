import { find, map, max, forEach, clone, filter, orderBy } from 'lodash'
import Vue from 'vue'

import { generateCrud } from './vuex_resource'

import uuid from 'uuid/v4'

const TemplateModel = {
  name: 'templates',

  relationships: [
    { relation: 'hasMany', model: 'layer', dependent: true }
  ],

  create(templateObject) {
    return {
      id: uuid(),
      layerIds: [],
      size: {
        w: 2.5,
        h: 3.5
      }
    }
  },

  getters: {
    findAllTemplateLayers: (_, __, ___, rootGetters) => template => {
      let layers = rootGetters.findAllLayers(template.layerIds)
      return orderBy(layers, ["renderOrder"], ["asc"])
    },

    getTemplateNextLayerOrder: (_, getters) => template => {
      let layers = getters.findAllTemplateLayers(template)
      return (max(map(layers, "renderOrder")) + 1) || 0
    },
  },

  actions: {
    createTemplateLayer: ({ dispatch, commit, getters }, { template, layerType }) => {
      const renderOrder = getters.getTemplateNextLayerOrder(template)

      let layer = {
        type: layerType,
        name: `[${layerType}] ${renderOrder}`,
        renderOrder
      }

      // Commit record to global collection begets an id
      dispatch("createLayer", layer).then((layerId) => {
        // Commit only the record id to referencing collections
        commit("pushTemplateLayerId", { template, layerId })
      })
    },

    destroyTemplateLayer: ({ dispatch, commit, getters }, { template, layer }) => {
      // Layers only exist in one template, so they get globally purged immediately
      dispatch("destroyLayer", layer)
      commit("destroyTemplateLayer", { template, layer })
      dispatch("setLayersRenderOrder", getters.findAllTemplateLayers(template))
    }
  },

  mutations: {
    pushTemplateLayerId: (state, { template, layerId }) => {
      template.layerIds.push(layerId)
    },

    destroyTemplateLayer: (state, { template, layer }) => {
      // remove the layer in question
      template.layerIds.splice(template.layerIds.indexOf(layer.id), 1)
    }
  }
}


const TemplatesModule = generateCrud(TemplateModel)

export default TemplatesModule
