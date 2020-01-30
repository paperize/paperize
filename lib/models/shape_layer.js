import { validateEqual, validateIncluded, validateBoolean, validateColor,
  validateDecimalBetween, transformEach } from './validations'

export const SHAPE_TYPE = 'shape'

export const VALID_SHAPES = ["rectangle", "roundedRectangle", "ellipse"]

export const DEFAULT_SHAPE_LAYER = {
  name:          "[Shape]",
  type:          SHAPE_TYPE,
  renderOrder:   0,
  hide:          false,
  dimensionId:   null,
  shape:         "rectangle",
  strokePresent: true,
  strokeWidth:   0.1,
  strokeColor:   "#000000",
  fillPresent:   false,
  fillColor:     "#000000",
}

export const SHAPE_LAYER_VALIDATIONS = {
  type: validateEqual(SHAPE_TYPE),
  shape: validateIncluded(VALID_SHAPES),
  strokePresent: validateBoolean,
  strokeWidth: validateDecimalBetween(0, 2),
  strokeColor: validateColor,
  fillPresent: validateBoolean,
  fillColor: validateColor,
}

// Validation deletes wayward keys and rolls back errant ones
export const validateShapeLayer = (newLayer, fallbackLayer=DEFAULT_SHAPE_LAYER) => {
  return transformEach(newLayer, fallbackLayer, SHAPE_LAYER_VALIDATIONS, { doTransform: false })
}

// Transformation converts valid short-hand values into final, usable ones
export const transformShapeLayer = (newLayer, fallbackLayer=DEFAULT_SHAPE_LAYER) => {
  return transformEach(newLayer, fallbackLayer, SHAPE_LAYER_VALIDATIONS, { doTransform: true })
}
