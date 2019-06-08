import jsPDF from 'jspdf'
import axios from 'axios'

export function loadFont(fontName, fontVariant, fontBase64) {
  var callAddFont = function () {
    const fontIndexName = `${fontName}-${fontVariant}.ttf`
    this.addFileToVFS(fontIndexName, fontBase64)
    this.addFont(fontIndexName, fontName, fontVariant)
  }

  jsPDF.API.events.push(['addFonts', callAddFont])
}

export function preloadFonts(fonts) {
  const font = fonts[0]
  console.log(font)
  urlToBase64(font.location)
    .then((fontBase64) => {
      loadFont(font.family, font.variant, fontBase64)
    })
}

function urlToBase64(url) {
  return axios.get(url, { responseType: 'blob' })
    .then((response) => response.data)

    .then((blob) => new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onloadend = () => {
        // Remove the DataURL preamble, like:
        // data:font/ttf;base64
        // data:application/x-font-ttf;base64,
        // data:text/plain;base64,
        const base64Font = reader.result.replace(/^data:(.+)base64,/, "")
        resolve(base64Font)
      }
    }))
}
