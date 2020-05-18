import { defaults, groupBy, map, reduce } from 'lodash'
import { transformShapeLayer } from '../models/shape_layer'
import { transformTextLayer } from '../models/text_layer'
import { transformImageLayer } from '../models/image_layer'

const scaleLayer = (layer, scalingFactors) => {
  if(layer.strokeWidth && isFinite(scalingFactors.strokes)) {
    layer.strokeWidth *= scalingFactors.strokes
  }

  if(layer.textSize && isFinite(scalingFactors.fonts)) {
    layer.textSize *= scalingFactors.fonts
  }

  return layer
}

export const projectItem = function(item, layers, scalingFactors) {
  scalingFactors = defaults(scalingFactors, {
    fonts: 1,
    strokes: 1,
  })

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
  })

    .then((layers) => {
      return { layers: map(layers, layer => scaleLayer(layer, scalingFactors)) }
    })
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
