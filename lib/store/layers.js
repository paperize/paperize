import { forEach } from 'lodash'

import uuid from 'uuid/v4'

import { generateCrud } from './util/vuex_resource'

const TEXT = 'text'
const IMAGE = 'image'
const SHAPE = 'shape'

const LAYER_DEFAULTS = {}

LAYER_DEFAULTS[TEXT] =
  {
    name:                "[Text]",
    type:                TEXT,
    renderOrder:         0,
    visible:             true,
    dimensionId:         null,
    textFontName:        "helvetica",
    textFontStyle:       "normal",
    textContentTemplate: "",
    textColor:           "#000000",
    textSize:            16,
    horizontalAlignment: "left",
    verticalAlignment:   "top"
  }
LAYER_DEFAULTS[IMAGE] =
  {
    name:                "[Image]",
    type:                IMAGE,
    renderOrder:         0,
    visible:             true,
    dimensionId:         null,
    imageNameStatic:     true,
    imageId:             null,
    imageNamePrefix:     "",
    imageNameProperty:   null,
    imageNameSuffix:     "",
    imageScaling:        "fillToBox",
    horizontalAlignment: "center",
    verticalAlignment:   "middle"
  }
LAYER_DEFAULTS[SHAPE] =
  {
    name:          "[Shape]",
    type:          SHAPE,
    renderOrder:   0,
    visible:       true,
    dimensionId:   null,
    shape:         "rectangle",
    strokePresent: true,
    strokeWidth:   0.1,
    strokeColor:   "#000000",
    fillPresent:   false,
    fillColor:     "#000000",
  }

const LayerModel = {
  name: 'layers',

  relationships: [
    { relation: 'hasOne', model: 'dimension', initialize: true, dependent: true }
  ],

  create(layerObject) {
    let { type } = layerObject,
      layer = { ...LAYER_DEFAULTS[type], ...layerObject }

    if(!layer) {
      throw new Error(`No Layer Type found matching "${type}"`)
    }

    layer.id = uuid()

    return layer
  },

  getters: {
    getLayerDimensions: (_, __, ___, rootGetters) => layer => {
      return rootGetters.findDimension(layer.dimensionId)
    }
  },

  actions: {
    setLayersRenderOrder: ({ commit }, layers) => {
      commit("setLayersRenderOrder", layers)
    },

    toggleLayer: ({ dispatch }, layer) => {
      dispatch("updateLayer", { ...layer, visible: !layer.visible })
    },

  },

  mutations: {
    setLayersRenderOrder: (state, layers) => {
      forEach(layers, (layer, index) => layer.renderOrder = index)
    },

  }
}

const LayersModule = generateCrud(LayerModel)


export default LayersModule
export { LAYER_DEFAULTS }
