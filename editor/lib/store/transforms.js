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

const DEFAULT_RENDER_FUNCTION = `
// function(doc, helpers, dimensions, game, component, item) {
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
        renderOrder: nextOrder,
        dimensions: { x: 1, y: 1, w: 1, h: 1 },
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
