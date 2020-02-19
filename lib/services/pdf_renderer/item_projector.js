import { groupBy, reduce } from 'lodash'
import { transformShapeLayer } from '../../models/shape_layer'
import { transformTextLayer } from '../../models/text_layer'
import { transformImageLayer } from '../../models/image_layer'

export const projectItem = function(layer, item) {
  const magicPropertyLayer = constructMagicPropertyLayer(layer, item)

  switch(layer.type){
  case "shape":
    layer = transformShapeLayer(magicPropertyLayer, layer)
    break
  case "text":
    layer = transformTextLayer(magicPropertyLayer, layer)
    break
  case "image":
    layer = transformImageLayer(magicPropertyLayer, layer)
    break
  default:
    throw new Error(`Unrecognized layer type: ${layer.type}`)
  }

  return layer
}

const constructMagicPropertyLayer = (layer, item) => {
  const
    itemsGroupedToLayerName = groupBy(item, ({ key = "" }) => key.split(":")[0]),
    attributesForThisLayer = itemsGroupedToLayerName[layer.name],
    magicPropertyLayer = reduce(attributesForThisLayer, (accumulatingLayer, { key, value }) => {
      const attributeName = key.split(":")[1]
      if(attributeName) {
        accumulatingLayer[attributeName] = value
      }
      return accumulatingLayer
    }, {})

  return magicPropertyLayer
}
