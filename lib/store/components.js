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

    let component = {
      title:            "",
      spreadsheetId:    null,
      worksheetId:      null,
      templateId:       null,
      quantityProperty: null,
      // override with given
      ...newComponent
    }

    component.id = uuid()

    return component
  },

  getters: {
    findComponentTemplate: (_, __, ___, rootGetters) => component => {
      if(component.templateId) {
        return rootGetters.findTemplate(component.templateId, false)
      }
    },

    findComponentSheet: (_, __, ___, rootGetters) => component => {
      return rootGetters.findSpreadsheet(component.spreadsheetId, false)
    },

    getComponentItems: (state, getters, _, rootGetters) => component => {
      if(!component.spreadsheetId || !component.worksheetId) {
        return []
      } else {
        const sheetItems = rootGetters.worksheetItems(component.spreadsheetId,
          component.worksheetId, component.worksheetFirstRow, component.worksheetLastRow)

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
    },

    getRowCount: (_, __, ___, rootGetters) => component => {
      return rootGetters.worksheetItems(component.spreadsheetId, component.worksheetId).length
    },
  },

  actions: {

    copyComponentTemplate({ dispatch }, { component, template }) {
      // Commit record to global collection begets an id
      dispatch("copyTemplate", template).then((templateId) => {
        // Updating the component with the new template id
        dispatch("updateComponent", { ...component, templateId })
      })
    },

    linkComponentSheet({ dispatch }, { component, spreadsheetId }) {
      dispatch("patchComponent", {
        id: component.id,
        spreadsheetId,
        worksheetId: null,
        worksheetFirstRow: null,
        worksheetLastRow: null,
        quantityProperty: null
      })
    },

    setComponentWorksheet({ dispatch }, { component, worksheetId }) {
      dispatch("patchComponent", {
        id: component.id,
        worksheetId,
        worksheetFirstRow: null,
        worksheetLastRow: null,
        quantityProperty: null
      })
    },

    unlinkComponentSheet({ dispatch }, component) {
      dispatch("patchComponent", {
        id: component.id,
        spreadsheetId: null,
        worksheetId: null,
        worksheetFirstRow: null,
        worksheetLastRow: null,
        quantityProperty: null
      })
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
    },

    createComponentSpreadsheetWorksheet({ dispatch }, { component, worksheetTitle }) {
      if(!component.spreadsheetId) { return Promise.resolve() }

      return Bluebird.try(() => {
        // Create the worksheet in Google Sheets
        return dispatch("googleAddSheetToSpreadsheet", {
          spreadsheetId: component.spreadsheetId,
          sheetName: worksheetTitle
        })
          // Link the newly created worksheet to the newly created component
          .then((worksheetId) => {
            return dispatch("patchComponent", {
              id: component.id,
              worksheetId
            })
          })
      })
    },

  }
}

const ComponentsModule = generateCrud(ComponentModel)

export default ComponentsModule
