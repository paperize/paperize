import { validateEqual, validateIncluded,
  validateBoolean, transformEach } from './validations'
import { getImageById, getImageByName } from '../services/image_provider'
import { findProperty } from './helpers'

export const IMAGE_TYPE = 'image'

export const IMAGE_SCALING_OPTIONS = [ "fitToBox", "fillToBox", "stretch" ]
export const VERTICAL_ALIGNMENTS = [ "top", "middle", "bottom" ]
export const HORIZONTAL_ALIGNMENTS = [ "left", "center", "right" ]

export const DEFAULT_IMAGE_LAYER = {
  name:                "[Image]",
  type:                IMAGE_TYPE,
  renderOrder:         0,
  visible:             true,
  dimensionId:         null,
  imageNameStatic:     true,
  imageId:             null,
  imageNamePrefix:     "",
  imageNameProperty:   null,
  imageNameSuffix:     "",
  imageScaling:        "fillToBox",
  horizontalAlignment: "center",
  verticalAlignment:   "middle"
}

export const IMAGE_LAYER_VALIDATIONS = {
  type:                validateEqual(IMAGE_TYPE),
  visible:             validateBoolean,
  imageNameStatic:     validateBoolean,
  imageId:             null,
  imageNamePrefix:     "",
  imageNameProperty:   null,
  imageNameSuffix:     "",
  imageScaling:        validateIncluded(IMAGE_SCALING_OPTIONS),
  horizontalAlignment: validateIncluded(HORIZONTAL_ALIGNMENTS),
  verticalAlignment:   validateIncluded(VERTICAL_ALIGNMENTS)
}

// Validation deletes wayward keys and rolls back errant ones
export const validateImageLayer = (newLayer, fallbackLayer=DEFAULT_IMAGE_LAYER) => {
  return transformEach(newLayer, fallbackLayer, IMAGE_LAYER_VALIDATIONS, { doTransform: false })
}

// Transformation converts valid short-hand values into final, usable ones
export const transformImageLayer = (newLayer, fallbackLayer=DEFAULT_IMAGE_LAYER, item) => {
  const layer = transformEach(newLayer, fallbackLayer, IMAGE_LAYER_VALIDATIONS, { doTransform: true })
  let imagePromise

  // Image find and fetch
  if(layer.imageNameStatic) {
    imagePromise = getImageById(layer.imageId)
  } else {
    const prefix = layer.imageNamePrefix,
      property = findProperty(item, layer.imageNameProperty),
      suffix = layer.imageNameSuffix,
      imageName = `${prefix}${property}${suffix}`

    imagePromise = getImageByName(imageName)
  }

  return imagePromise.then((image) => {
    layer.image = image
    return layer
  })
}
