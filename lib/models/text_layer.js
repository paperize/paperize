import { find, includes, reduce } from 'lodash'
import { validateBoolean, validateEqual, validateIncluded, validateColor,
  validateIntegerBetween, transformEach } from './validations'
import mustache from '../services/tiny-mustache'
import { getFontByLocation } from '../services/font_provider'
import store from '../store'

export const
  TEXT_TYPE = 'text',
  VERTICAL_ALIGNMENTS = [ "top", "middle", "bottom" ],
  HORIZONTAL_ALIGNMENTS = [ "left", "center", "right" ],
  // default fonts are PDF-only
  DEFAULT_FONT_FAMILIES = ["helvetica", "courier", "times", "symbol", "zapfdingbats"],

  DEFAULT_TEXT_LAYER = {
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
  },

  TEXT_LAYER_VALIDATIONS = {
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
export const transformTextLayer = (newLayer, fallbackLayer=DEFAULT_TEXT_LAYER, item) => {
  const
    layer = transformEach(newLayer, fallbackLayer, TEXT_LAYER_VALIDATIONS, { doTransform: true })

  layer.renderedText = renderTextTemplate(item, layer)

  const
    family = layer.textFontName,
    variant = layer.textFontStyle,
    location = findGoogleFont(family, variant)

  // jsPDF
  // layer.font = {
  //   family: `${family}-${variant}`,
  //   variant: "normal",
  //   location
  // }
  // // attach the asset to the font and resolve the layer
  // return loadFont(layer.font).then(() => layer)

  // Konva/PNG
  layer.font = { family, variant, location }
  // embed the font and remember to resolve the layer
  return embedFontIntoDocument(layer.font).then(() => layer)
}

const renderTextTemplate = (item, layer) => {
  const
    defaultTemplateVars = {
      // n0: (index).toString(),
      // n: (index+1).toString(),
      // q: total.toString()
    },

    textContentTemplateVars = reduce(item, (kvObject, itemPair) => {
      kvObject[itemPair.key] = itemPair.value
      return kvObject
    }, defaultTemplateVars),

    contentToRender = layer.textContentTemplate || textContentTemplateVars[layer.name],

    renderedText = contentToRender ? mustache(contentToRender, textContentTemplateVars) : ""

  return renderedText
}

const embedFontIntoDocument = ({ family, location }) => {
  if(!family || !location) { return Promise.resolve() }

  // Create a new FontFace pointing to the font family and location
  const font = new FontFace(`${family}`, `url(${location})`)

  // Load FontFace and then add it
  return font.load().then( face => document.fonts.add(face) )
}

const loadFont = (font) => {
  return Promise.try(() => {
    if(font.location && !includes(DEFAULT_FONT_FAMILIES, font.family) ) {
      // time to fetch
      return getFontByLocation(font.location)
        .then((base64) => {
          font.base64 = base64
          return font
        })
    } else {
      return font
    }
  })
}

const findGoogleFont = (family, variant) => {
  const googleFont = find(store.getters.googleFontsRaw, { family })
  return googleFont && googleFont.variants[variant]
}
