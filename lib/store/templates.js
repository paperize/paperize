import { find, includes, map, max, orderBy } from 'lodash'

import { generateCrud } from './util/vuex_resource'

import uuid from 'uuid/v4'

const TemplateModel = {
  name: 'templates',

  relationships: [
    { relation: 'hasMany', model: 'layer', dependent: true }
  ],

  create() {
    return {
      id: uuid(),
      layerIds: [],
      size: {
        w: 2.5,
        h: 3.5,
        paperMode: "standard",
        paperFormat: "poker",
        paperOrientation: "landscape"
      }
    }
  },

  getters: {
    findAllTemplateLayers: (_, __, ___, rootGetters) => template => {
      let layers = rootGetters.findAllLayers(template.layerIds)
      return orderBy(layers, ["renderOrder"], ["asc"])
    },

    findAllVisibleTemplateLayers: (_, __, ___, rootGetters) => template => {
      let layers = rootGetters.findAllLayers(template.layerIds).filter(l => l.visible)
      return orderBy(layers, ["renderOrder"], ["asc"])
    },

    getTemplateNextLayerOrder: (_, getters) => template => {
      let layers = getters.findAllTemplateLayers(template)
      return (max(map(layers, "renderOrder")) + 1) || 0
    },

    findTemplateByLayerId: state => layerId => {
      return find(state.templates, (template) => {
        return includes(template.layerIds, layerId)
      })
    },
  },

  actions: {
    copyTemplateLayer: ({ dispatch, commit }, { template, layer }) => {
      // Commit record to global collection begets an id
      dispatch("copyLayer", layer).then((newLayerId) => {
        // Commit only the record id to referencing collections
        commit("insertTemplateLayerId", { template, layerId: newLayerId, afterLayerId: layer.id })
      })
    },

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

    insertTemplateLayerId: (state, { template, layerId, afterLayerId }) => {
      const index = template.layerIds.indexOf(afterLayerId) + 1
      template.layerIds.splice(index, 0, layerId)
    },

    destroyTemplateLayer: (state, { template, layer }) => {
      // remove the layer in question
      template.layerIds.splice(template.layerIds.indexOf(layer.id), 1)
    }
  }
}


const TemplatesModule = generateCrud(TemplateModel)

export default TemplatesModule
