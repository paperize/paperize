import Vue from 'vue'

const TransformsModule = {
  state: {

  },

  getters: {
    transforms: (state, getters) => component => {
      return getters.sourceProperties(component.source).map((property) => {
        return {
          name: `Expose: ${property}`,
          type: "Raw"
        }
      })
    },

    activeTransforms: (state, getters) => {
      return getters.activeComponent && getters.transforms(getters.activeComponent)
    }
  }
}

export default TransformsModule
