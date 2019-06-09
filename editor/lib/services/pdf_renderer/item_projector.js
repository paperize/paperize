import { find, invokeMap, map, filter, reduce } from 'lodash'

export const projectItem = function(layer, item) {
  const matches = matchingAttributes(layer, item)

  if(matches) {
    layer = layerModifer(layer, matches)
  }

  return layer
}

const matchingAttributes = (layer, item) => {
  const
    splitNames = filter(
      invokeMap(
        map(item, "key"), 'split', ':'),
      ["length", 2]),

    layerMatchers = map(splitNames, ({ 0: layerName, 1: attributeName }) => {
      const key = `${layerName}:${attributeName}`

      return {
        itemValue: find(item, { key }).value,
        layerName: layerName,
        attributeName: attributeName
      }
    }),

    matchingLayerMatchers = filter(layerMatchers, { layerName: layer.name }),
    matchingAttributeMatchers = filter(matchingLayerMatchers, (layerMatcher) => !!layer[layerMatcher.attributeName] ),
    matchesWithValues = filter(matchingAttributeMatchers, "itemValue" )

  return matchesWithValues
}

const layerModifer = (layer, matches) => {
  return reduce(matches, (acc, { itemValue, attributeName }) => {
    acc[attributeName] = itemValue

    return acc
  }, { ...layer })
}
