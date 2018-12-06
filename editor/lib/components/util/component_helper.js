import { isUndefined } from 'lodash'

const computedVModelUpdate = function(objectName, actionName, propertyToUpdate) {
  return {
    get() {
      let object = this[objectName]
      if(isUndefined(object)) { throw new Error(`Object name must exist on component for vmodel helper: "${objectName}"`)}
      let property = object[propertyToUpdate]
      if(isUndefined(property)) { throw new Error(`Property must exist for vmodel helper: "${propertyToUpdate}"`)}
      return this[objectName][propertyToUpdate]
    },

    set(propertyValue) {
      let keyValueObject = {}
      keyValueObject[propertyToUpdate] = propertyValue
      let actionPayload = { ...this[objectName], ...keyValueObject }
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
