import jsPDF from 'jspdf'
import axios from 'axios'
import { includes } from 'lodash'

const addedFontLocations = []

export function preloadFonts(fonts) {
  return Promise.each(fonts, (font) => {
    // don't do this if we've already done it
    if(includes(addedFontLocations, font.location)) {
      return
    }

    // font has not been loaded
    return urlToBase64(font.location)
      .then((fontBase64) => {
        pushFontIntoJsPDF(font.family, font.variant, fontBase64)
        // remember we did this so we never do it again
        addedFontLocations.push(font.location)
      })
  })
}

// Black magic I tell you.
function urlToBase64(url) {
  return axios.get(url, { responseType: 'blob' })
    .then((response) => response.data)

    .then((blob) => new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onloadend = () => {
        // Remove the DataURL preamble, like:
        // data:font/ttf;base64,
        // data:application/x-font-ttf;base64,
        const base64Font = reader.result.replace(/^data:(.+)base64,/, "")
        resolve(base64Font)
      }
    }))
}

export function pushFontIntoJsPDF(fontName, fontVariant, fontBase64) {
  var callAddFont = function () {
    const fontIndexName = `${fontName}-${fontVariant}.ttf`
    this.addFileToVFS(fontIndexName, fontBase64)
    this.addFont(fontIndexName, fontName, fontVariant)
  }

  jsPDF.API.events.push(['addFonts', callAddFont])
}
