import { forEach } from 'lodash'

import uuid from 'uuid/v4'

import { generateCrud } from './vuex_resource'

const CODE = 'code'
const TEXT = 'text'
const IMAGE = 'image'
const SHAPE = 'shape'

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
    name:                "[Text]",
    type:                TEXT,
    renderOrder:         0,
    dimensionId:         null,
    textContentTemplate: "",
    textColor:           "#000000",
    textSize:            16,
    // textFontId:            null
  }
LAYER_DEFAULTS[IMAGE] =
  {
    name:                "[Image]",
    type:                IMAGE,
    renderOrder:         0,
    dimensionId:         null,
    imageNameStatic:     true,
    imageName:           null,
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
    dimensionId:   null,
    shape:         "rectangle",
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
    dimensionId:  null,
    renderFunction: DEFAULT_RENDER_FUNCTION
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
    }
  },

  mutations: {
    setLayersRenderOrder: (state, layers) => {
      forEach(layers, (layer, index) => layer.renderOrder = index)
    }
  }
}

const LayersModule = generateCrud(LayerModel)


export default LayersModule
