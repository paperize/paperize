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

const TransformsModule = {
  state: {

  },

  getters: {
    getComponentTransforms: (state, getters) => component => {
      return getters.sourceProperties(component.source).map((property) => {
        return {
          renderOrder: 1,
          dimensions: { x: .05, y: .05, w: 100, h: 20 },
          renderFunction(doc, game, component, item) {
            console.log(`render ${item[0]}`)

            doc.setFontSize(10)
            doc.text(`${item[0].key}: ${item[0].value}`, this.dimensions.x, this.dimensions.y)

          }
        }
      })
    },

    activeTransforms: (state, getters) => {
      return getters.activeComponent && getters.getComponentTransforms(getters.activeComponent)
    }
  }
}

export default TransformsModule
