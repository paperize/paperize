import { find } from 'lodash'

export const findProperty = (item, key) => {
  const property = find(item, { key })
  console.log("Findprop:", item, key, property)
  if(property) {
    return property.value
  } else {
    console.log(`No property found by key: ${key}`)
    return ""
  }
}
