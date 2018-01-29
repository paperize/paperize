import { hexToRGB } from './helpers'

// easy to render a rect given dimensions
const dimensionRect = function(doc, dimensions, mode="S") {
  doc.rect(dimensions.x, dimensions.y, dimensions.w, dimensions.h, mode)
  // doc.roundedRect(dimensions.x, dimensions.y, dimensions.w, dimensions.h, .1, .1, mode)
}

export default {
  render(doc, layer, layerDimensions) {
    // Determine where the stroke goes:

    // Half inside/half outside the dimensions?
    // DO NOTHING

    // Inside the dimensions?
    layerDimensions.x += layer.strokeWidth/2
    layerDimensions.y += layer.strokeWidth/2
    layerDimensions.w -= layer.strokeWidth
    layerDimensions.h -= layer.strokeWidth

    // Outside the dimensions?
    // TODO

    // Set colors and line width based on layer settings
    let { r: fr, g: fg, b: fb } = hexToRGB(layer.fillColor)
    doc.setFillColor(fr, fg, fb)

    let { r: sr, g: sg, b: sb } = hexToRGB(layer.strokeColor)
    doc.setDrawColor(sr, sg, sb)

    doc.setLineWidth(layer.strokeWidth)

    // Stroke fill
    let strokeFillMode
    if(layer.strokePresent && layer.fillPresent) {
      strokeFillMode = "DF"
    } else if(layer.strokePresent) {
      strokeFillMode = "S"
    } else if(layer.fillPresent) {
      strokeFillMode = "F"
    }
    dimensionRect(doc, layerDimensions, strokeFillMode)
  }
}
