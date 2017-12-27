import { map, max, forEach } from 'lodash'
import Vue from 'vue'
/*
 * Transform Fields:
 * - render order
 * - dimensions: x, y, w, h
 * - function
 *
 * Transform Parameters:
 * - source item inputs
 * - source items collection
 * - component
 * - game
 * - helper methods: validation, defaulting, type casting, asset lookup, http
 * - scoped doc object
 */

const CODE = 'Code'
const TEXT = 'Text'
const IMAGE = 'Image'

const TYPES = [ CODE, TEXT, IMAGE ]

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

const TemplatesModule = {
  state: { },

  getters: {
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
    //
    // updateTransformRenderFunction(state, { transform, renderFunction }) {
    //   transform.renderFunction = renderFunction
    // },

    updateLayerName(state, { layer, name }) {
      layer.name = name
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

    addTemplateLayer({ commit, getters }, template) {
      const nextOrder = getters.getTemplateNextLayerOrder(template)

      let layer = {
        name: `Layer ${nextOrder}`,
        type: CODE,
        renderOrder: nextOrder,
        renderFunction: DEFAULT_RENDER_FUNCTION
      }

      commit("addTemplateLayer", { template, layer })
    },

    setTemplateLayers({ commit }, { template, layers }) {
      commit("setTemplateLayers", { template, layers })
    },
    //
    // updateTransformRenderFunction({ commit }, { transform, renderFunction }) {
    //   // TODO: validate/compile/test/check the function
    //   commit("updateTransformRenderFunction", { transform, renderFunction })
    // },
    //
    deleteTemplateLayer({ commit }, { template, layer }) {
      commit("deleteTemplateLayer", { template, layer })
    }
  }
}

export default TemplatesModule
