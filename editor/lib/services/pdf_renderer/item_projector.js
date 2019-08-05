import { groupBy, reduce } from 'lodash'
import { transformShapeLayer } from '../../models/shape_layer'
import { transformTextLayer } from '../../models/text_layer'
import { transformImageLayer } from '../../models/image_layer'

export const projectItem = function(layer, item) {
  const pseudoLayer = constructPseudoLayer(layer, item)

  switch(layer.type){
  case "shape":
    layer = transformShapeLayer(pseudoLayer, layer)
    break
  case "text":
    layer = transformTextLayer(pseudoLayer, layer)
    break
  case "image":
    layer = transformImageLayer(pseudoLayer, layer)
    break
  default:
    throw new Error(`Why you no validate! ${layer.type}`)
  }

  return layer
}

const constructPseudoLayer = (layer, item) => {
  const
    groupedToLayerName = groupBy(item, ({ key = "" }) => key.split(":")[0]),
    attributesForThisLayer = groupedToLayerName[layer.name],
    pseudoLayer = reduce(attributesForThisLayer, (acc, { key, value }) => {
      const attributeName = key.split(":")[1]
      if(attributeName) {
        acc[attributeName] = value
      }
      return acc
    }, {})

  return pseudoLayer
}
