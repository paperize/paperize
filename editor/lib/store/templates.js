import { find, map, max, forEach, clone, filter, orderBy } from 'lodash'
import Vue from 'vue'

import { generateCrud } from './vuex_resource'

import uuid from 'uuid/v4'

const TemplateModel = {
  name: 'templates',

  relationships: [
    { relation: 'hasMany', model: 'layer' }
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
  }
}

const TemplatesModule = generateCrud(TemplateModel)

// TemplatesModule.actions.createComponentTemplate = ({ commit }, component) => {
//   dispatch("createTemplate")
//   commit("setComponentTemplate", {component, template })
// }

TemplatesModule.getters.findAllTemplateLayers = (state, getters, rootState, rootGetters) => template => {
  let layers = rootGetters.findAllLayers(template.layerIds)

  return orderBy(layers, ["renderOrder"], ["asc"])
}

TemplatesModule.getters.getTemplateNextLayerOrder = (state, getters) => template => {
  let layers = getters.findAllTemplateLayers(template)
  return (max(map(layers, "renderOrder")) + 1) || 0
},

TemplatesModule.actions.createTemplateLayer = ({ dispatch, commit, getters }, { template, layerType }) => {
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
}

TemplatesModule.actions.destroyTemplateLayer = ({ dispatch, commit, getters }, { template, layer }) => {
  // Layers only exist in one template, so they get globally purged immediately
  dispatch("destroyLayer", layer)
  commit("destroyTemplateLayer", { template, layer })
  dispatch("setLayersRenderOrder", getters.findAllTemplateLayers(template))
}

// TemplatesModule.mutations.setComponentTemplate = (state, { component, template }) => {
//   component.template = template
// }

TemplatesModule.mutations.pushTemplateLayerId = (state, { template, layerId }) => {
  template.layerIds.push(layerId)
}

// TemplatesModule.mutations.setTemplateLayerIds = (state, { template, layerIds }) => {
//   template.layerIds = layerIds
// }

// TemplatesModule.mutations.updateTemplateSize = (state, { template, size }) => {
//   template.size = size
// }

TemplatesModule.mutations.destroyTemplateLayer = (state, { template, layer }) => {
  // remove the layer in question
  template.layerIds.splice(template.layerIds.indexOf(layer.id), 1)
}

export default TemplatesModule
