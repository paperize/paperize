import jsPDF from 'jspdf'
import axios from 'axios'
import { includes } from 'lodash'
import { getCachedFont, setCachedFont } from '../../font_cache'

const addedFontLocations = []

export function preloadFonts(fonts) {
  return Bluebird.each(fonts, (font) => {
    // bail if this font has already been loaded into jspdf
    if(!font.location || includes(addedFontLocations, font.location)) {
      return
    }

    // check the cache first
    return getCachedFont(font.location)
      .then((fontBase64) => {
        if(fontBase64) {
          // cache hit, move on!
          return fontBase64
        } else {
          // cache miss, actually do the work
          return urlToBase64(font.location)
            // set cache
            .then(fontBase64 => setCachedFont(font.location, fontBase64).then(() => fontBase64))
        }
      })

      .then((fontBase64) => {
        // do the work
        pushFontIntoJsPDF(font.family, font.variant, fontBase64)
        // and remember it
        addedFontLocations.push(font.location)
      })
  })
}

// Black magic I tell you.
function urlToBase64(url) {
  // strip the scheme off the url so it matches whatever we are
  url = url.replace(/^http(s?):/, "")
  return Bluebird.try(() => axios.get(url, { responseType: 'blob' })
    .then((response) => response.data)

    .then((blob) => new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onloadend = () => {
        // Remove the DataURL preamble, like:
        // data:font/ttf;base64,
        // data:application/x-font-ttf;base64,
        const indexAfterPreamble = (reader.result.indexOf("base64,")+7),
          base64Font = reader.result.substr(indexAfterPreamble)
        resolve(base64Font)
      }
    }))
  )
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
