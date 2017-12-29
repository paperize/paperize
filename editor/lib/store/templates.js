import { find, map, max, forEach, clone, filter, orderBy } from 'lodash'
import Vue from 'vue'

import uuid from 'uuid/v4'

const TemplatesModule = {
  state: { },

  getters: {
    getTemplateLayers: (state, getters, rootState, rootGetters) => template => {
      let layers = rootGetters.findLayers(template.layerIds)
      // let layers = template.layerIds.map(layerId => rootGetters.findLayer(layerId))

      return orderBy(layers, ["renderOrder"], ["asc"])
    },

    getTemplateNextLayerOrder: (state, getters) => template => {
      let layers = getters.getTemplateLayers(template)
      return (max(map(layers, "renderOrder")) + 1) || 0
    },
  },

  mutations: {
    setComponentTemplate(state, { component, template }) {
      component.template = template
    },

    pushTemplateLayerId(state, { template, layerId }) {
      template.layerIds.push(layerId)
    },

    setTemplateLayerIds(state, { template, layerIds }) {
      template.layerIds = layerIds
    },

    updateTemplateSize(state, { template, size }) {
      template.size = size
    },

    deleteTemplateLayer(state, { template, layer, layersToDecrement }) {
      // remove the layer in question
      template.layerIds.splice(template.layerIds.indexOf(layer.id), 1)
    }
  },

  actions: {
    createComponentTemplate({ commit }, component) {
      let template = {
        layerIds: [], // this template's layer collection
        size: { w: 2.5, h: 3.5 }
      }
      commit("setComponentTemplate", {component, template })
    },

    addTemplateLayer({ dispatch, commit, getters }, { template, layerType }) {
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

    deleteTemplateLayer({ dispatch, commit, getters }, { template, layer }) {
      // Layers only exist in one template, so they get globally purged immediately
      commit("deleteLayer", layer)
      commit("deleteTemplateLayer", { template, layer })
      dispatch("setLayersRenderOrder", getters.getTemplateLayers(template))
    }
  }
}

export default TemplatesModule
