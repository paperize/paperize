import { find, map, max, forEach, clone } from 'lodash'
import Vue from 'vue'

import uuid from 'uuid/v4'
/*
 * Layer Fields:
 * - id
 * - render order
 * - dimensions: x, y, w, h
 * - type specific fields to be filled in form
 * - function that leverages those fields
 *
 * Transform Parameters:
 * - source item inputs
 * - source items collection
 * - component
 * - game
 * - helper methods: validation, defaulting, type casting, asset lookup, http
 * - scoped doc object
 */

const CODE = 'code'
const TEXT = 'text'
const IMAGE = 'image'
const SHAPE = 'shape'

const LAYER_TYPES = [ CODE, TEXT, IMAGE, SHAPE ]

const SAME_AS_PARENT = "sameAsParent",
  PERCENT_OF_PARENT = "percentOfParent",
  OFFSET_FROM_PARENT = "offsetFromParent"

const DIMENSION_OBJECT = {
  mode: SAME_AS_PARENT,
  x: 5, y: 5, w: 90, h: 90
}

const DEFAULT_RENDER_FUNCTION = `
// Common tasks, all measurements in inches
// Official docs here: http://rawgit.com/MrRio/jsPDF/master/docs/

// Fetch the "Strength" column for this Item from your data Source:
// var strength = helpers.findProperty("Strength")

// Set the font size to 12 points:
// doc.setFontSize(12)

// Render "Text to render" an inch from the left and an inch from the top
// doc.text("Text to render", 1, 1)

// Insert the Image named "/my-game/my-image.jpg" at the top left corner
// (must be last thing you do in a given Transform):
// return helpers.image("/my-game/my-image.jpg", 0, 0)
`

const LAYER_DEFAULTS = {}
LAYER_DEFAULTS[TEXT] =
  {
    name:        "[Text]",
    type:        TEXT,
    renderOrder: 0,
    dimensions:  DIMENSION_OBJECT,
  }
LAYER_DEFAULTS[IMAGE] =
  {
    name:        "[Image]",
    type:        IMAGE,
    renderOrder: 0,
    dimensions:  DIMENSION_OBJECT,
  }
LAYER_DEFAULTS[SHAPE] =
  {
    name:        "[Shape]",
    type:        SHAPE,
    renderOrder: 0,
    dimensions:  DIMENSION_OBJECT,
  }
LAYER_DEFAULTS[CODE] =
  {
    name:        "[Code]",
    type:        CODE,
    renderOrder: 0,
    dimensions:  DIMENSION_OBJECT,
    renderFunction: DEFAULT_RENDER_FUNCTION
  }

const TemplatesModule = {
  state: { },

  getters: {
    findTemplateLayer: (state, getters) => (template, layerId) => {
      return find(template.layers, { id: layerId })
    },

    getTemplateLayers: (state, getters) => template => {
      return template.layers
    },

    getTemplateNextLayerOrder: (state, getters) => template => {
      let layers = getters.getTemplateLayers(template)
      return (max(map(layers, "renderOrder")) + 1) || 1
    },
  },

  mutations: {
    setComponentTemplate(state, { component, template }) {
      Vue.set(component, "template", template)
    },

    addTemplateLayer(state, { template, layer }) {
      template.layers.push(layer)
    },

    setTemplateLayers(state, { template, layers }) {
      template.layers = layers
    },

    updateLayerRenderFunction(state, { layer, renderFunction }) {
      layer.renderFunction = renderFunction
    },

    setLayerName(state, { layer, name }) {
      layer.name = name
    },

    setLayerDimension(state, { layer, dimension, value }) {
      let newDim = layer.dimensions
      newDim[dimension] = value
      Vue.set(layer, "dimensions", newDim)
    },

    updateTemplateSize(state, { template, size }) {
      template.size = size
    },

    deleteTemplateLayer(state, { template, layer }) {
      const removedOrder = layer.renderOrder
      // remove the layer in question
      template.layers.splice(template.layers.indexOf(layer), 1)
      // decrement the render order for layers higher than the removed one
      forEach(template.layers, (layer) => {
        if(layer.renderOrder > removedOrder) {
          layer.renderOrder -= 1
        }
      })
    }
  },

  actions: {
    createComponentTemplate({ commit }, component) {
      let template = {
        layers: [],
        size: { w: 2.5, h: 3.5 }
      }
      commit("setComponentTemplate", {component, template })
    },

    addTemplateLayer({ commit, getters }, { template, layerType }) {
      const nextOrder = getters.getTemplateNextLayerOrder(template)

      let layer = LAYER_DEFAULTS[layerType]
      if(!layer) {
        throw new Error(`No Layer Type found matching "${layerType}"`)
      }
      layer = clone(layer)
      layer.id = uuid()
      layer.name += ` ${nextOrder}`
      layer.renderOrder = nextOrder
      console.log(layer.renderFunction)

      commit("addTemplateLayer", { template, layer })
    },

    setTemplateLayers({ commit }, { template, layers }) {
      commit("setTemplateLayers", { template, layers })
    },

    setLayerName({ commit }, { layer, name }) {
      commit("setLayerName", { layer, name })
    },

    setLayerDimension({ commit }, { layer, dimension, value }) {
      commit("setLayerDimension", { layer, dimension, value })
    },

    updateLayerRenderFunction({ commit }, { layer, renderFunction }) {
      // TODO: validate/compile/test/check the function
      commit("updateLayerRenderFunction", { layer, renderFunction })
    },

    deleteTemplateLayer({ commit }, { template, layer }) {
      commit("deleteTemplateLayer", { template, layer })
    }
  }
}

export default TemplatesModule
