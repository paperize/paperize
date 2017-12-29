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
      console.log('pushing', layerId)
      template.layerIds.push(layerId)
    },

    setTemplateLayerOrder(state, { template, layers }) {
      forEach(layers, (layer, index) => layer.renderOrder = index)
    },

    setTemplateLayerIds(state, { template, layerIds }) {
      template.layerIds = layerIds
    },

    updateTemplateSize(state, { template, size }) {
      template.size = size
    },

    deleteTemplateLayer(state, { template, layer, layersToDecrement }) {
      // const removedOrder = layer.renderOrder
      // remove the layer in question
      template.layerIds.splice(template.layerIds.indexOf(layer.id), 1)
      // decrement the render order for layers higher than the removed one
      forEach(layersToDecrement, (layer) => {
        console.log('decrementing', layer)
        // if(layer.renderOrder > removedOrder) {
          layer.renderOrder -= 1
        // }
      })
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

    setTemplateLayers({ commit }, { template, layers }) {
      commit("setTemplateLayerOrder", { template, layers })
    },

    deleteTemplateLayer({ commit, getters }, { template, layer }) {
      let layersToDecrement = filter(getters.getTemplateLayers(template), thisLayer => thisLayer.renderOrder > layer.renderOrder)
      // Layers only exist in one template, so they get globally purged immediately
      commit("deleteLayer", layer)
      commit("deleteTemplateLayer", { template, layer, layersToDecrement })
    }
  }
}

export default TemplatesModule
