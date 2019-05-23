import jsPDF from 'jspdf'
import { loadFont } from "./fonts/font_loader.js"

// fetch("http://themes.googleusercontent.com/static/fonts/anonymouspro/v3/Zhfjj_gat3waL4JSju74E-V_5zh5b-_HiooIRUBwn1A.ttf")
fetch("http://fonts.gstatic.com/s/indieflower/v10/m8JVjfNVeKWVnh3QMuKkFcZlbkGG1dKEDw.ttf")
  .then((response) => response.blob())

  .then((blob) => new Promise((resolve) => {
    var reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onloadend = () => {
      // Remove the DataURL preamble
      const base64Font = reader.result.replace("data:font/ttf;base64,", "")
      resolve(base64Font)
    }
  }))

  .then((fontBase64) => {
    loadFont(jsPDF.API, "Indie Flower", "normal", fontBase64)
  })


export function singlePageDocOfSize(size) {
  const doc = startEmptyDocument()

  doc.addPage([size.w, size.h])

  return doc
}

export function startEmptyDocument() {
  // Set units
  const doc = new jsPDF({ unit: 'in' })
  // Clear the auto-generated page
  doc.deletePage(1)

  return doc
}
