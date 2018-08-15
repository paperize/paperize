import { hexToRGB } from './helpers'

// easy to render a rect given dimensions
const dimensionRect = function(doc, dimensions, mode="S") {
  doc.rect(dimensions.x, dimensions.y, dimensions.w, dimensions.h, mode)
}

const dimensionRoundedRect = function(doc, dimensions, mode="S") {
  doc.roundedRect(dimensions.x, dimensions.y, dimensions.w, dimensions.h, .1, .1, mode)
}

const dimensionEllipse = function(doc, dimensions, mode="S") {
  doc.ellipse((dimensions.x+dimensions.w/2), (dimensions.y+dimensions.h/2), dimensions.w/2, dimensions.h/2, mode)
}

export default {
  render(doc, layer, layerDimensions) {
    if(layer.strokePresent){
      // JSPDF strokes in and out from the boundaries
      // Determine where the stroke goes and modify dimensions

      // Half inside/half outside the dimensions?
      // DO NOTHING, this is JSPDF default

      // Inside the dimensions?
      // I think this is what people expect by default
      layerDimensions.x += layer.strokeWidth/2
      layerDimensions.y += layer.strokeWidth/2
      layerDimensions.w -= layer.strokeWidth
      layerDimensions.h -= layer.strokeWidth

      // Outside the dimensions?
      // TODO when we need to support options
    }

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

    if(layer.shape === "rectangle") {
      dimensionRect(doc, layerDimensions, strokeFillMode)
    } else if(layer.shape === "roundedRectangle") {
      dimensionRoundedRect(doc, layerDimensions, strokeFillMode)
    } else if(layer.shape === "ellipse") {
      dimensionEllipse(doc, layerDimensions, strokeFillMode)
    }
  }
}
