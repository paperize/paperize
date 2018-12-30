import { reduce } from 'lodash'
import mustache from '../../services/tiny-mustache'
import { hexToRGB } from './helpers'

const PTS_PER_INCH = 72,
  LINE_HEIGHT = 1.2

export default {
  render(doc, layer, layerDimensions, item, index, total) {
    const
      // Extract color channels
      { r, g, b } = hexToRGB(layer.textColor),

      // Build-in some helper functions to the template variables
      defaultTemplateVars = {
        n0: (index).toString(),
        n: (index+1).toString(),
        q: total.toString()
      },

      // Add in the user-generated template variables (source properties)
      textContentTemplateVars = reduce(item, (kvObject, itemPair) => {
        kvObject[itemPair.key] = itemPair.value
        return kvObject
      }, defaultTemplateVars),

      // Render the template to a string
      renderedText = mustache(layer.textContentTemplate, textContentTemplateVars)

    // Configure text settings before writing
    doc.setTextColor(r, g, b)
    doc.setFont(layer.textFontName)
    doc.setFontStyle(layer.textFontStyle)
    doc.setFontSize(layer.textSize)

    // Convert horizontal alignment setting to an X offset
    const horizontalAlignment = layer.horizontalAlignment || "left"
    let alignmentOffsetX = 0
    if(horizontalAlignment == "center") {
      alignmentOffsetX += layerDimensions.w/2
    } else if(horizontalAlignment == "right") {
      alignmentOffsetX += layerDimensions.w
    }

    let fontSize = doc.internal.getFontSize(),
      finalX = layerDimensions.x + alignmentOffsetX,
      finalY,
      splitText

    while(fontSize > 0) {
      // Line Height Formula: fontSize * lineHeight / ptsPerInch
      const oneLineHeight = fontSize * LINE_HEIGHT / PTS_PER_INCH
      splitText = doc.splitTextToSize(renderedText, layerDimensions.w)
      const textHeight = splitText.length * oneLineHeight

      if(textHeight <= layerDimensions.h) {
        // We're good! Convert vertical alignment to a Y offset
        const verticalAlignment = layer.verticalAlignment || "top"
        let alignmentOffsetY = 0
        if(verticalAlignment == "middle") {
          alignmentOffsetY = (layerDimensions.h - textHeight)/2
        } else if(verticalAlignment == "bottom") {
          alignmentOffsetY = layerDimensions.h - textHeight
        }
        // Finalize the Y position
        finalY = layerDimensions.y + oneLineHeight*5/6 + alignmentOffsetY
        break

      } else {
        // Text doesn't fit yet, reduce font size and try again
        fontSize -= 1
        doc.setFontSize(fontSize)
      }
    }

    doc.text(splitText, finalX, finalY, { align: horizontalAlignment })
  }
}
