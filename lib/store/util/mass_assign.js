import { forEach, isUndefined } from 'lodash'

const massAssign = function(target, attributes) {
  forEach(attributes, (value, key) => {
    if(!isUndefined(target[key])) {
      target[key] = value
    } else {
      throw new Error(`No mass assignment of non-existent keys: ${key}`)
    }
  })
}

export default massAssign
