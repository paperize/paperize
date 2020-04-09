import { defaults } from 'lodash'

const imageBox = function(doc, image, boxDimensions, options) {
  // helpers.drawGuideBox(boxDimensions)
  options = defaults(options, {
    horizontalAlignment: "center",
    verticalAlignment:   "top",
    scaleMode:           "fillToBox"
  })
  const boxRatio = boxDimensions.w / boxDimensions.h


  let imageRatio = image.width / image.height,
    finalX = boxDimensions.x,
    finalY = boxDimensions.y,
    finalW = boxDimensions.w,
    finalH = boxDimensions.h

  if(options.scaleMode == "fillToBox") {
    let cropX = 0,
      cropY = 0,
      cropW = image.width,
      cropH = image.height

    // create a canvas with dimensions matching the image's cropped to the box's ratio
    // add the image to the canvas with these offsets
    // export the canvas as a data URI

    if(imageRatio > boxRatio) { // image is widthier than box
      cropW *= boxRatio/imageRatio
      const widthOffset = image.width - cropW

      // Manage Horizontal Alignment
      if(options.horizontalAlignment == "center") {
        cropX += widthOffset/2

      } else if(options.horizontalAlignment == "right") {
        cropX += widthOffset
      }

    } else { // image is heightier than box
      cropH *= imageRatio/boxRatio
      const heightOffset = image.height - cropH

      // Manage Vertical Alignment
      if(options.verticalAlignment == "middle") {
        cropY += heightOffset/2

      } else if(options.verticalAlignment == "bottom") {
        cropY += heightOffset
      }
    }

    const canvas = document.createElement("canvas"),
      ctx = canvas.getContext("2d"),
      maxWidth = finalW * 300,
      widthOverage = Math.max(image.width - maxWidth, 0)/image.width,
      maxHeight = finalH * 300,
      heightOverage = Math.max(image.height - maxHeight, 0)/image.height

    let canvasWidth = cropW,
      canvasHeight = cropH

    // Adjust canvas width/height
    if(widthOverage < heightOverage) {
      canvasWidth = canvasWidth - (canvasWidth * widthOverage)
      canvasHeight = canvasHeight - (canvasHeight * widthOverage)
    } else if(heightOverage < widthOverage) {
      canvasWidth = canvasWidth - (canvasWidth * heightOverage)
      canvasHeight = canvasHeight - (canvasHeight * heightOverage)
    }

    canvas.width = canvasWidth
    canvas.height = canvasHeight

    // ctx.fillRect(0, 0, cropW, cropH)

    ctx.drawImage(image,
      cropX, cropY, cropW, cropH,
      0, 0, canvasWidth, canvasHeight)

    doc.addImage(
      canvas.toDataURL(),
      finalX,
      finalY,
      finalW,
      finalH
    )

  } else if(options.scaleMode == "fitToBox") {
    if(imageRatio > boxRatio) { // image is widthier than box
      // Squeeze Height
      finalH *= boxRatio/imageRatio

      // Manage Vertical Alignment
      if(options.verticalAlignment == "middle") {
        finalY += (boxDimensions.h - finalH)/2

      } else if(options.verticalAlignment == "bottom") {
        finalY += boxDimensions.h - finalH
      }

    } else { // image is heightier than box
      // Squeeze Width
      finalW *= imageRatio/boxRatio

      // Manage Horizontal Alignment
      if(options.horizontalAlignment == "center") {
        finalX += (boxDimensions.w - finalW)/2

      } else if(options.horizontalAlignment == "right") {
        finalX += (boxDimensions.w - finalW)
      }
    }

    doc.addImage(
      image,
      finalX,
      finalY,
      finalW,
      finalH
    )
    // We just stretch the image to the size of the box
  } else if(options.scaleMode == "stretch") {
    doc.addImage(
      image,
      boxDimensions.x,
      boxDimensions.y,
      boxDimensions.w,
      boxDimensions.h
    )
  }
}

export default {
  render(doc, layer) {
    let { horizontalAlignment, verticalAlignment, imageScaling } = layer

    return imageBox(doc, layer.image, layer.dimensions, { horizontalAlignment, verticalAlignment, scaleMode: imageScaling })
  }
}
