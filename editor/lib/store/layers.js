import { forEach, isNil, clone, defaults } from 'lodash'

import Vue from 'vue'
import uuid from 'uuid/v4'

const CODE = 'code'
const TEXT = 'text'
const IMAGE = 'image'
const SHAPE = 'shape'

const LAYER_TYPES = [ CODE, TEXT, IMAGE, SHAPE ]

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
    name:         "[Text]",
    type:         TEXT,
    renderOrder:  0,
    dimensionsId: null
  }
LAYER_DEFAULTS[IMAGE] =
  {
    name:         "[Image]",
    type:         IMAGE,
    renderOrder:  0,
    dimensionsId: null
  }
LAYER_DEFAULTS[SHAPE] =
  {
    name:          "[Shape]",
    type:          SHAPE,
    renderOrder:   0,
    dimensionsId:  null,
    strokePresent: true,
    strokeWidth:   0.1,
    strokeColor:   "#000000",
    fillPresent:   false,
    fillColor:     "#000000",
  }
LAYER_DEFAULTS[CODE] =
  {
    name:         "[Code]",
    type:         CODE,
    renderOrder:  0,
    dimensionsId: null,
    renderFunction: DEFAULT_RENDER_FUNCTION
  }

const LayersModule = {
  state: {
    layers: {}
  },

  getters: {
    findLayer: state => layerId => state.layers[layerId],
    findLayers: state => layerIds => layerIds.map(layerId => state.layers[layerId]),
    getLayerDimensions: (_, __, ___, rootGetters) => layer => rootGetters.findDimensions(layer.dimensionsId)
  },

  mutations: {
    createLayer(state, layer ) {
      Vue.set(state.layers, layer.id, layer)
    },

    deleteLayer(state, layer) {
      delete state.layers[layer.id]
    },

    updateLayer(state, { layer, keyValueObject }) {
      forEach(keyValueObject, (value, key) => {
        if(!isNil(layer[key])) {
          layer[key] = value
        } else {
          throw new Error(`No mass assignment of non-existent keys: ${key}`)
        }
      })
    },

    setLayerRenderFunction(state, { layer, renderFunction }) {
      layer.renderFunction = renderFunction
    },

    setLayerName(state, { layer, name }) {
      layer.name = name
    },

    setLayerDimensions(state, { layer, dimensions }) {
      layer.dimensionsId = dimensions.id
    },

    setLayersRenderOrder(state, layers) {
      forEach(layers, (layer, index) => layer.renderOrder = index)
    },
  },

  actions: {
    createLayer({ dispatch, commit }, layerObject={}) {
      let { type } = layerObject,
          layer = { ...LAYER_DEFAULTS[type], ...layerObject }

      // early out: invalid layer type
      if(!layer) {
        throw new Error(`No Layer Type found matching "${layerType}"`)
      }

      return dispatch("createDimensions").then((dimensionsId) => {
        layer.id = uuid()
        layer.dimensionsId = dimensionsId
        // clone it up and commit it, returns the ID
        commit("createLayer", clone(layer))

        return layer.id
      })

    },

    updateLayer({ commit }, { layer, keyValueObject }) {
      commit("updateLayer", { layer, keyValueObject })
    },

    setLayerName({ commit }, { layer, name }) {
      commit("setLayerName", { layer, name })
    },

    setLayerDimensions({ commit }, { layer, dimensions }) {
      commit("setLayerDimensions", { layer, dimensions })
    },

    setLayerRenderFunction({ commit }, { layer, renderFunction }) {
      // TODO: validate/compile/test/check the function
      commit("setLayerRenderFunction", { layer, renderFunction })
    },

    setLayersRenderOrder({ commit }, layers) {
      commit("setLayersRenderOrder", layers)
    },
  },
}

export default LayersModule
