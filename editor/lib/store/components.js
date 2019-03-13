import { find, isNaN, reduce, times } from 'lodash'
import uuid from 'uuid/v4'

import { generateCrud } from './util/vuex_resource'

const ComponentModel = {
  name: 'components',

  relationships: [
    { relation: 'hasOne', model: 'template', initialize: true, dependent: true },
    { relation: 'hasOne', model: 'sheet' }
  ],

  create(newComponent) {
    return {
      id:            uuid(),
      title:         "",
      spreadsheetId:       null,
      worksheetId:   null,
      templateId:    null,
      quantityProperty: null,
      // override with given
      ...newComponent
    }
  },

  getters: {
    getComponentFolderId: (_, __, ___, rootGetters) => component => {
      return component.folderId ||
        rootGetters.getGameFolderId(
          rootGetters.findGameByComponentId(component.id)
        )
    },

    findComponentTemplate: (_, __, ___, rootGetters) => component => {
      if(component.templateId) {
        return rootGetters.findTemplate(component.templateId)
      }
    },

    findComponentSheet: (_, __, ___, rootGetters) => component => {
      return rootGetters.findSheet(component.spreadsheetId, false)
    },

    getComponentItems: (state, getters, _, rootGetters) => component => {
      if(!component.spreadsheetId || !component.worksheetId) {
        return []
      } else {
        const sheetItems = rootGetters.worksheetItems(component.spreadsheetId, component.worksheetId)

        // Check for quantity expansion
        if(!component.quantityProperty) {
          return sheetItems
        } else {
          // Handle quantity expansion
          return reduce(sheetItems, (expandedItems, item) => {
            let foundProperty = find(item, { key: component.quantityProperty }),
              rawQuantity = (foundProperty || {}).value,
              quantity = parseInt(rawQuantity, 10)

            if(isNaN(quantity)) {
              quantity = 1
            }

            times(quantity, () => expandedItems.push(item))

            return expandedItems
          }, [])
        }
      }
    },

    getItemQuantity: (state, getters) => component => {
      return getters.getComponentItems(component).length
    }
  },

  actions: {
    linkComponentSheet({ dispatch }, { component, spreadsheetId }) {
      dispatch("patchComponent", { id: component.id, spreadsheetId, worksheetId: null, quantityProperty: null })
    },

    setComponentWorksheet({ dispatch }, { component, worksheetId }) {
      dispatch("patchComponent", { id: component.id, worksheetId, quantityProperty: null })
    },

    unlinkComponentSheet({ dispatch }, component) {
      dispatch("patchComponent", { id: component.id, spreadsheetId: null, worksheetId: null, quantityProperty: null })
    },

    createComponentFolder({ getters, dispatch }, componentId) {
      const game = getters.findGameByComponentId(componentId),
        component = getters.findComponent(componentId),
        gameFolderId = getters.getGameFolderId(game)

      return dispatch("googleCreateFolder", { name: component.title, parentId: gameFolderId })
        .then((folderId) => {
          const savedComponent = getters.findComponent(componentId)
          return dispatch("updateComponent", { ...savedComponent, folderId })
        })
    },

    createComponentImageFolder({ getters, dispatch }, componentId) {
      const componentFolderId = getters.findComponent(componentId).folderId

      return dispatch("createAndAddImageFolder", { parentId: componentFolderId })
    }
  }
}

const ComponentsModule = generateCrud(ComponentModel)

export default ComponentsModule
