import { each } from 'lodash'
import jsPDF from 'jspdf'

export const embedFonts = (fonts) => {
  // TODO: purge fonts from PDF...
  each(fonts, ({ family, variant, base64}) => {
    if(!(family && variant && base64)) {
      console.warn(`jsPDF Font Embed Failed for ${family} ${variant}`)
      return
    }
    // do the work
    pushFontIntoJsPDF(family, variant, base64)
    // and remember it
    // TODO: ...or remember what's been added?
    // addedFontLocations.push(font.location)
  })
}




export function pushFontIntoJsPDF(fontName, fontVariant, fontBase64) {
  var callAddFont = function () {
    const fontNameNoWhitespace = fontName.replace(/ /g, ""),
      fontIndexName = `${fontNameNoWhitespace}-${fontVariant}.ttf`
    this.addFileToVFS(fontIndexName, fontBase64)
    this.addFont(fontIndexName, fontNameNoWhitespace, fontVariant)
  }

  jsPDF.API.events.push(['addFonts', callAddFont])
}
