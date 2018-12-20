import { defaults, reduce } from 'lodash'
import mustache from '../../services/tiny-mustache'
import { hexToRGB } from './helpers'

const textBox = function(doc, text, boxDimensions, options) {
  options = defaults(options, {
    horizontalAlignment: "center"
  })

  let alignmentOffsetX = 0

  if(options.horizontalAlignment == "center") {
    alignmentOffsetX += boxDimensions.w/2
  } else if(options.horizontalAlignment == "right") {
    alignmentOffsetX += boxDimensions.w
  }

  // Line Height Formula: fontSize * lineHeight / ptsPerInch
  const oneLineHeight = doc.internal.getFontSize() * 1.2 / 72,
    finalX = boxDimensions.x + alignmentOffsetX,
    finalY = boxDimensions.y + oneLineHeight

  text = doc.splitTextToSize(text, boxDimensions.w)
  doc.text(text, finalX, finalY, { align: options.horizontalAlignment })
}

export default {
  render(doc, layer, layerDimensions, item, index, total) {
    doc.setFont(layer.textFontName)
    doc.setFontStyle(layer.textFontStyle)
    doc.setFontSize(layer.textSize)
    const { r, g, b } = hexToRGB(layer.textColor)
    doc.setTextColor(r, g, b)

    // Expose some tools to the user via built-in template variables
    const defaultTemplateVars = {
      n0: (index).toString(),
      n: (index+1).toString(),
      q: total.toString()
    }

    // Add in the user-generated template variables (source properties)
    const textContentTemplateVars = reduce(item, (kvObject, itemPair) => {
      kvObject[itemPair.key] = itemPair.value
      return kvObject
    }, defaultTemplateVars)

    // Render the template to a string
    const textContentTemplate = mustache(layer.textContentTemplate, textContentTemplateVars),
      horizontalAlignment = layer.horizontalAlignment

    // Draw the string to the PDF
    textBox(doc, textContentTemplate, layerDimensions, { horizontalAlignment })
  }
}
