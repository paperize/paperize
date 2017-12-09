import { map, max, forEach } from 'lodash'
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

const TransformsModule = {
  state: { },

  getters: {
    getComponentTransforms: (state, getters) => component => {
      return component.transforms
    },

    getComponentNextTransformOrder: (state, getters) => component => {
      let transforms = getters.getComponentTransforms(component)
      return (max(map(transforms, "renderOrder")) + 1) || 1
    },

    activeTransforms: (state, getters) => {
      return getters.activeComponent && getters.getComponentTransforms(getters.activeComponent)
    }
  },

  mutations: {
    addTransform(state, { component, transform }) {
      if(!component.transforms) {
        component.transforms = []
      }

      component.transforms.push(transform)
    },

    updateTransformRenderFunction(state, { transform, renderFunction }) {
      transform.renderFunction = renderFunction
    },

    updateTransformName(state, { transform, name }) {
      transform.name = name
    },

    setComponentTransforms(state, { component, transforms }) {
      component.transforms = transforms
    },

    deleteTransform(state, { component, transform }) {
      const removedOrder = transform.renderOrder
      // remove the transform in question
      component.transforms.splice(component.transforms.indexOf(transform), 1)
      // decrement the render order for transforms higher than the removed one
      forEach(component.transforms, (transform) => {
        if(transform.renderOrder > removedOrder) {
          transform.renderOrder -= 1
        }
      })
    }
  },

  actions: {
    addTransform({ commit, getters }, component) {
      const nextOrder = getters.getComponentNextTransformOrder(component)

      let transform = {
        name: `Trans: ${nextOrder}`,
        type: CODE,
        renderOrder: nextOrder,
        renderFunction: DEFAULT_RENDER_FUNCTION
      }

      commit("addTransform", { component, transform })
    },

    updateTransformRenderFunction({ commit }, { transform, renderFunction }) {
      // TODO: validate/compile/test/check the function
      commit("updateTransformRenderFunction", { transform, renderFunction })
    },

    deleteTransform({ commit }, { component, transform }) {
      commit("deleteTransform", { component, transform })
    }
  }
}

export default TransformsModule
