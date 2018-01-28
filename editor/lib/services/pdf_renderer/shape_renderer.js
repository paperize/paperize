import { hexToRGB } from './helpers'

// easy to render a rect given dimensions
const easyRect = function(doc, dimensions, mode="S") {
  doc.rect(dimensions.x, dimensions.y, dimensions.w, dimensions.h, mode)
  // doc.roundedRect(dimensions.x, dimensions.y, dimensions.w, dimensions.h, .1, .1, mode)
}

export default {
  render(doc, layer, layerDimensions) {
    // extract RGB255 from hex
    let { r: fr, g: fg, b: fb } = hexToRGB(layer.fillColor)
    doc.setFillColor(fr, fg, fb)
    let { r: sr, g: sg, b: sb } = hexToRGB(layer.strokeColor)
    doc.setDrawColor(sr, sg, sb)
    doc.setLineWidth(layer.strokeWidth)

    if(layer.strokePresent && layer.fillPresent) {
      easyRect(doc, layerDimensions, "DF")
    } else if(layer.strokePresent) {
      easyRect(doc, layerDimensions, "S")
    } else if(layer.fillPresent) {
      easyRect(doc, layerDimensions, "F")
    }
  }
}
