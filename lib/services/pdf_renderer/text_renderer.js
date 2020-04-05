import { includes } from 'lodash'

const
  PTS_PER_INCH = 72,
  LINE_HEIGHT = 1.2,
  MIN_FONT_SIZE = 4

export default {
  render(doc, layer) {
    // const { r: textRed, g: textGreen, b: textBlue } = layer.textColor

    // Configure font/text settings
    // doc.setTextColor(textRed, textGreen, textBlue)
    doc.setFontSize(layer.textSize)
    doc.setFontStyle("normal")

    const defaultFontFamilies = ["helvetica", "courier", "times", "symbol", "zapfdingbats"]
    if(includes(defaultFontFamilies, layer.textFontName)){
      // do it the normal way for built-in fonts
      doc.setFont(layer.textFontName)
      doc.setFontStyle(layer.textFontStyle)

    } else {
      // do it the family-per-variant way for the rest
      // and don't forget to collapse whitespace in the family!
      const fontFamilyNoWhitespace = layer.textFontName.replace(/ /g, ""),
        familyWithVariant = `${fontFamilyNoWhitespace}-${layer.textFontStyle}`

      doc.setFont(familyWithVariant)
    }

    // Convert horizontal alignment setting to an X offset
    const horizontalAlignment = layer.horizontalAlignment || "left"
    let alignmentOffsetX = 0
    if(horizontalAlignment == "center") {
      alignmentOffsetX += layer.dimensions.w/2
    } else if(horizontalAlignment == "right") {
      alignmentOffsetX += layer.dimensions.w
    }

    let fontSize = doc.internal.getFontSize(),
      finalX = layer.dimensions.x + alignmentOffsetX,
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
        splitText = doc.splitTextToSize(layer.renderedText, layer.dimensions.w, options)
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
      if(textHeight <= layer.dimensions.h || fontSize == MIN_FONT_SIZE) {
        // We're good! Convert vertical alignment to a Y offset
        const verticalAlignment = layer.verticalAlignment || "top"
        let alignmentOffsetY = 0
        if(verticalAlignment == "middle") {
          alignmentOffsetY = (layer.dimensions.h - textHeight)/2
        } else if(verticalAlignment == "bottom") {
          alignmentOffsetY = layer.dimensions.h - textHeight
        }
        // Finalize the Y position
        finalY = layer.dimensions.y + oneLineHeight*5/6 + alignmentOffsetY
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
