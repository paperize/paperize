import { each, includes } from 'lodash'
import jsPDF from 'jspdf'

let previouslyAddedFonts = []

export const embedFonts = (fonts) => {
  each(fonts, ({ family, variant, location, base64}) => {
    if(!(family && variant && base64)) {
      console.warn(`jsPDF Font Embed Failed for ${family} ${variant}`)
      return
    }

    if(!includes(previouslyAddedFonts, location)) {
      // do the work
      pushFontIntoJsPDF(family, variant, base64)
      // and remember it
      previouslyAddedFonts.push(location)
    }
  })
}

const pushFontIntoJsPDF = (fontName, fontVariant, fontBase64) => {
  var callAddFont = function () {
    const fontNameNoWhitespace = fontName.replace(/ /g, ""),
      fontIndexName = `${fontNameNoWhitespace}-${fontVariant}.ttf`
    this.addFileToVFS(fontIndexName, fontBase64)
    this.addFont(fontIndexName, fontNameNoWhitespace, fontVariant)
  }

  jsPDF.API.events.push(['addFonts', callAddFont])
}
