import { map, max } from 'lodash'
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

const DEFAULT_RENDER_FUNCTION = function(doc, game, component, item) {
  doc.setFontSize(10)
  doc.text("" + item[0].key + ":" + item[0].value, this.dimensions.x, this.dimensions.y)
}.toString()

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
    }
  }
}

export default TransformsModule
