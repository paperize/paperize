import { groupBy, reduce } from 'lodash'
import { transformShapeLayer } from '../models/shape_layer'
import { transformTextLayer } from '../models/text_layer'
import { transformImageLayer } from '../models/image_layer'

export const projectItem = function(item, layers) {
  return Promise.map(layers, (layer) => {
    const magicPropertyLayer = constructMagicPropertyLayer(layer, item)

    switch(layer.type){
    case "shape":
      return transformShapeLayer(magicPropertyLayer, layer)
    case "text":
      return transformTextLayer(magicPropertyLayer, layer, item)
    case "image":
      return transformImageLayer(magicPropertyLayer, layer, item)
    default:
      throw new Error(`Unrecognized layer type: ${layer.type}`)
    }
  }).then((layers) => { return { layers} })
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
