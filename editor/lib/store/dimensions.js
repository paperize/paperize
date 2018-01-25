import { clone } from 'lodash'
import uuid from 'uuid/v4'
import Vue from 'vue'

const SAME_AS_PARENT = "sameAsParent",
  PERCENT_OF_PARENT = "percentOfParent",
  OFFSET_FROM_PARENT = "offsetFromParent"

const DIMENSION_OBJECT = {
  mode: SAME_AS_PARENT,
  x: 5, y: 5, w: 90, h: 90
}


const DimensionModule = {
  state: {
    dimensions: {}
  },

  getters: {
    findDimensions: state => dimensionsId => state.dimensions[dimensionsId]
  },

  mutations: {
    createDimensions(state, dimensions) {
      Vue.set(state.dimensions, dimensions.id, dimensions)
    },

    setDimensions(state, dimensions) {
      state.dimensions[dimensions.id] = dimensions
    }
  },

  actions: {
    createDimensions({ commit }) {
      let dimensions = { ...DIMENSION_OBJECT }
      dimensions.id = uuid()

      commit("createDimensions", dimensions)

      return dimensions.id
    },

    setDimensions({ commit, getters }, dimensions) {
      if(getters.findDimensions(dimensions.id)) {
        commit("setDimensions", dimensions)
      } else {
        throw new Error(`setDimensions could not find dimensions with id: ${dimensions.id}`)
      }
    }
  }
}

export default DimensionModule
