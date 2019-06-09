import { find, invokeMap, map, filter, reduce } from 'lodash'

export const projectItem = function(layer, item) {
  const layerMatches = matchingAttributes(layer, item)

  if(layerMatches) {
    layer = layerModifer(layer, item)
  }

  return layer
}

const matchingAttributes = (layer, item) => {
  const
    splitNames = invokeMap(map(item, "key"), 'split', ':'),
    layerMatchers = map(splitNames, (nameParts) => {
      return {
        layerName: nameParts[0],
        attributeName: nameParts[1]
      }
    }),
    matchingLayerMatchers = filter(layerMatchers, { layerName: layer.name }),
    matchingAttributeMatchers = filter(matchingLayerMatchers, (layerMatcher) => !!layer[layerMatcher.attributeName] )

  return matchingAttributeMatchers
}

const layerModifer = (layer, item) => {
  return reduce(matchingAttributes(layer, item), (acc, match) => {
    const
      key = `${match.layerName}:${match.attributeName}`,
      matchingKey = find(item, { key })

    // This shouldn't be possible because the attribute matched
    if(!matchingKey) {
      throw new Error(`Expected to match ${key}`)
    }

    // only overwrite the default if we have something to overwrite with
    if(matchingKey.value) {
      acc[match.attributeName] = matchingKey.value
    }

    return acc
  }, { ...layer })
}
