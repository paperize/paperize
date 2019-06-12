import { includes, reduce } from 'lodash'
import mustache from '../../services/tiny-mustache'

const PTS_PER_INCH = 72,
  LINE_HEIGHT = 1.2,
  MIN_FONT_SIZE = 4

export default {
  render(doc, layer, layerDimensions, item, index, total) {
    const
      // Extract color channels
      { r: textRed, g: textGreen, b: textBlue } = layer.textColor,

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

      // If no content given, check for Layer-Aligned-Column-Names
      contentToRender = layer.textContentTemplate || textContentTemplateVars[layer.name],

      // Render the template to a string
      renderedText = contentToRender ? mustache(contentToRender, textContentTemplateVars) : ""

    // Configure font/text settings
    doc.setTextColor(textRed, textGreen, textBlue)
    doc.setFontSize(layer.textSize)

    const defaultFontFamilies = ["helvetica", "courier", "times", "symbol", "zapfdingbats"]
    if(includes(defaultFontFamilies, layer.textFontName)){
      // do it the normal way for built-in fonts
      doc.setFont(layer.textFontName)
      doc.setFontStyle(layer.textFontStyle)
    } else {
      // do it the family-per-variant way for the rest
      // and don't forget to collapse whitespace in the family!
      const fontFamilyNoWhitespace = layer.textFontName.replace(" ", ""),
        familyWithVariant = `${fontFamilyNoWhitespace}-${layer.textFontStyle}`

      doc.setFont(familyWithVariant)
    }

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

    // Shrink-to-Fit: detect when text is too wide or tall for the box and
    // back off the font size until it fits, or we hit the minimum size
    while(fontSize >= MIN_FONT_SIZE) {
      // Do horizontal fit first
      try {
        const options = {
          throwOnWordSplit: fontSize != MIN_FONT_SIZE
        }
        splitText = doc.splitTextToSize(renderedText, layerDimensions.w, options)
      } catch(e) {
        if(e.message == "Splitting a word") {
          // Text doesn't fit yet, reduce font size and try again
          fontSize -= 1
          doc.setFontSize(fontSize)
          continue
        } else {
          throw e
        }
      }

      // Line Height Formula: fontSize * lineHeight / ptsPerInch
      const oneLineHeight = fontSize * LINE_HEIGHT / PTS_PER_INCH,
        textHeight = splitText.length * oneLineHeight

      // Now do vertical fit
      if(textHeight <= layerDimensions.h || fontSize == MIN_FONT_SIZE) {
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
