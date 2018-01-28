import mustache from '../../services/tiny-mustache'
import { hexToRGB } from './helpers'

const textBox = function(doc, text, boxDimensions, options) {
  options = _.defaults(options, {})

  // Line Height Formula: fontSize * lineHeight / ptsPerInch
  const oneLineHeight = doc.internal.getFontSize() * 1.2 / 72,
    finalX = boxDimensions.x,
    finalY = boxDimensions.y + oneLineHeight

  text = doc.splitTextToSize(text, boxDimensions.w)
  doc.text(text, finalX, finalY, options.align)
}

export default {
  render(doc, layer, layerDimensions, item) {
    doc.setFontSize(layer.textSize)
    const { r, g, b } = hexToRGB(layer.textColor)
    doc.setTextColor(r, g, b)

    // Prepare template variables
    const textContentTemplateVars = _.reduce(item, (kvObject, itemPair) => {
      kvObject[itemPair.key] = itemPair.value
      return kvObject
    }, {})

    const textContentTemplate = mustache(layer.textContentTemplate, textContentTemplateVars)

    textBox(doc, textContentTemplate, layerDimensions, {})
  }
}
