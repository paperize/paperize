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
  render(doc, layer) {
    if(layer.strokePresent){
      // JSPDF strokes in and out from the boundaries
      // Determine where the stroke goes and modify dimensions

      // Half inside/half outside the dimensions?
      // DO NOTHING, this is JSPDF default

      // Inside the dimensions?
      // I think this is what people expect by default
      layer.dimensions.x += layer.strokeWidth/2
      layer.dimensions.y += layer.strokeWidth/2
      layer.dimensions.w -= layer.strokeWidth
      layer.dimensions.h -= layer.strokeWidth

      // Outside the dimensions?
      // TODO when we need to support options

      const { r: strokeRed, g: strokeGreen, b: strokeBlue } = layer.strokeColor.rgbObject

      doc.setDrawColor(strokeRed, strokeGreen, strokeBlue)
      doc.setLineWidth(layer.strokeWidth)
    }

    if(layer.fillPresent) {
      const { r: fillRed, g: fillGreen, b: fillBlue } = layer.fillColor.rgbObject
      doc.setFillColor(fillRed, fillGreen, fillBlue)
    }

    // Stroke fill
    let strokeFillMode
    if(layer.strokePresent && layer.fillPresent) {
      strokeFillMode = "DF"
    } else if(layer.strokePresent) {
      strokeFillMode = "S"
    } else if(layer.fillPresent) {
      strokeFillMode = "F"
    } else {
      // No stroke no fill? Nothing to draw at all!
      return
    }

    if(layer.shape === "rectangle") {
      dimensionRect(doc, layer.dimensions, strokeFillMode)
    } else if(layer.shape === "roundedRectangle") {
      dimensionRoundedRect(doc, layer.dimensions, strokeFillMode)
    } else if(layer.shape === "ellipse") {
      dimensionEllipse(doc, layer.dimensions, strokeFillMode)
    }
  }
}
