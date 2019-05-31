import { isUndefined } from 'lodash'

const computedVModelUpdate = function(objectName, actionName, propertyToUpdate) {
  return {
    get() {
      const object = this[objectName]
      if(isUndefined(object)) { throw new Error(`Object name must exist on component for vmodel helper: "${objectName}"`)}

      const property = object[propertyToUpdate]
      if(isUndefined(property)) { throw new Error(`Property must exist for vmodel helper: "${propertyToUpdate}"`)}

      return property
    },

    set(propertyValue) {
      let actionPayload = {}
      actionPayload[propertyToUpdate] = propertyValue

      // update payload
      // actionPayload = { ...this[objectName], ...keyValueObject }

      // patch payload
      actionPayload.id = this[objectName].id

      this[actionName](actionPayload)
    }
  }
}

const computedVModelUpdateAll = function(objectName, actionName, propertiesToUpdate) {
  return propertiesToUpdate.reduce((computedObject, propertyToUpdate) => {
    computedObject[propertyToUpdate] = computedVModelUpdate(objectName, actionName, propertyToUpdate)
    return computedObject
  }, {})
}

export { computedVModelUpdate, computedVModelUpdateAll }
