import { validateBoolean, validateEqual, validateIncluded, validateColor,
  validateIntegerBetween, transformEach } from './validations'

export const TEXT_TYPE = 'text'

export const VERTICAL_ALIGNMENTS = [ "top", "middle", "bottom" ]
export const HORIZONTAL_ALIGNMENTS = [ "left", "center", "right", "justify" ]

export const DEFAULT_TEXT_LAYER = {
  name:                "[Text]",
  type:                TEXT_TYPE,
  renderOrder:         0,
  visible:             true,
  dimensionId:         null,
  textFontName:        "helvetica",
  textFontStyle:       "normal",
  textContentTemplate: "",
  textColor:           "#000000",
  textSize:            16,
  horizontalAlignment: "left",
  verticalAlignment:   "top"
}

export const TEXT_LAYER_VALIDATIONS = {
  type:                validateEqual(TEXT_TYPE),
  visible:             validateBoolean,
  textColor:           validateColor,
  textSize:            validateIntegerBetween(1, 255),
  horizontalAlignment: validateIncluded(HORIZONTAL_ALIGNMENTS),
  verticalAlignment:   validateIncluded(VERTICAL_ALIGNMENTS)
}

// Validation deletes wayward keys and rolls back errant ones
export const validateTextLayer = (newLayer, fallbackLayer=DEFAULT_TEXT_LAYER) => {
  return transformEach(newLayer, fallbackLayer, TEXT_LAYER_VALIDATIONS, { doTransform: false })
}

// Transformation converts valid short-hand values into final, usable ones
export const transformTextLayer = (newLayer, fallbackLayer=DEFAULT_TEXT_LAYER) => {
  return transformEach(newLayer, fallbackLayer, TEXT_LAYER_VALIDATIONS, { doTransform: true })
}
