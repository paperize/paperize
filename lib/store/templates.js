import { capitalize, find, includes, map, max, orderBy } from 'lodash'

import { generateCrud } from './util/vuex_resource'

import uuid from 'uuid/v4'

const TemplateModel = {
  name: 'templates',

  relationships: [
    { relation: 'hasMany', model: 'layer', dependent: true }
  ],

  create(templateObject) {

    let template = {
      layerIds: [],
      size: {
        w: 2.5,
        h: 3.5,
        paperMode: "standard",
        paperFormat: "poker",
        paperOrientation: "landscape",
      },
      ...templateObject
    }

    template.id = uuid()

    return template
  },

  getters: {
    findAllTemplateLayers: (_, __, ___, rootGetters) => template => {
      let layers = rootGetters.findAllLayers(template.layerIds)
      return orderBy(layers, ["renderOrder"], ["asc"])
    },

    findAllVisibleTemplateLayers: (_, __, ___, rootGetters) => template => {
      let layers = rootGetters.findAllLayers(template.layerIds).filter(l => l.visible)
      return orderBy(layers, ["renderOrder"], ["asc"])
    },

    // Takes a potential name and returns a unique name based on it.
    // With no existing layers, calling this repeatedly with "Rank" will produce:
    // "Rank", "Rank (1)", "Rank (2)", "Rank (3)", etc
    getSafeLayerName: (_, getters) => (template, initialName = "New Layer") => {
      const layers = getters.findAllTemplateLayers(template)

      const nameIsAvailable = (name) => !find(layers, { name })

      if(nameIsAvailable(initialName)) {
        // the given name is available, we're done here
        return initialName

      } else {
        const trailingParenNumberRegex = /\((\d+)\)$/

        // make sure the name has the pattern in it
        if(!initialName.match(trailingParenNumberRegex)){
          initialName = `${initialName} (1)`
        }

        // use regex to find the pattern and try ever-higher numbers until one is available
        return initialName.replace(trailingParenNumberRegex, (copyNumberWithParens, copyNumberMatch) => {
          const copyNumber = parseInt(copyNumberMatch, 10)

          for(let i=0; i<100; i++) {
            const candidateName = initialName.replace(trailingParenNumberRegex, `(${copyNumber+i})`)

            if(nameIsAvailable(candidateName)) {
              return `(${copyNumber+i})`
            }
          }
        })
      }
    },

    getTemplateNextLayerOrder: (_, getters) => template => {
      const layers = getters.findAllTemplateLayers(template)
      return (max(map(layers, "renderOrder")) + 1) || 0
    },

    findTemplateByLayerId: state => layerId => {
      return find(state.templates, (template) => {
        return includes(template.layerIds, layerId)
      })
    },
  },

  actions: {
    reorderLayers: ({ getters, dispatch }, template) => {
      dispatch("setLayersRenderOrder", getters.findAllTemplateLayers(template))
    },

    copyTemplateLayer: ({ getters, dispatch, commit }, { template, layer }) => {
      const layerCopy = {
        ...layer,
        name: getters.getSafeLayerName(template, layer.name)
      }

      // Commit record to global collection begets an id
      dispatch("copyLayer", layerCopy).then((newLayerId) => {
        // Commit only the record id to referencing collections
        commit("insertTemplateLayerId", { template, layerId: newLayerId, afterLayerId: layer.id })
        dispatch("reorderLayers", template)
      })
    },

    createTemplateLayer: ({ dispatch, commit, getters }, { template, layerType }) => {
      const renderOrder = getters.getTemplateNextLayerOrder(template)

      let layer = {
        type: layerType,
        name: getters.getSafeLayerName(template, capitalize(layerType)),
        renderOrder
      }

      // Commit record to global collection begets an id
      dispatch("createLayer", layer).then((layerId) => {
        // Commit only the record id to referencing collections
        commit("pushTemplateLayerId", { template, layerId })
      })
    },

    destroyTemplateLayer: ({ dispatch, commit }, { template, layer }) => {
      // Layers only exist in one template, so they get globally purged immediately
      dispatch("destroyLayer", layer)
      commit("destroyTemplateLayer", { template, layer })
      dispatch("reorderLayers", template)
    }
  },

  mutations: {
    pushTemplateLayerId: (state, { template, layerId }) => {
      template.layerIds.push(layerId)
    },

    insertTemplateLayerId: (state, { template, layerId, afterLayerId }) => {
      const index = template.layerIds.indexOf(afterLayerId) + 1
      template.layerIds.splice(index, 0, layerId)
    },

    destroyTemplateLayer: (state, { template, layer }) => {
      // remove the layer in question
      template.layerIds.splice(template.layerIds.indexOf(layer.id), 1)
    }
  }
}


const TemplatesModule = generateCrud(TemplateModel)

export default TemplatesModule
