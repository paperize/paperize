import Promise from 'bluebird'
import store from '../../store'

// To get image data from our local store
const fetchDataByName = function(name) {
  return Promise.try(() => store.getters.findImageByName(name).then(asset => asset.data))
}

const fetchImageByName = function(name) {
  return fetchDataByName(name)

  .then((imageDataURI) => {
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = function() {
        resolve(image)
      }
      image.src = imageDataURI
    })
  })
}

// To get CORS-enabled images from the web
const toDataURL = function(url) {
  return fetch(url)

  .then(response => {
    return response.blob()
  })

  .then(blob => {
    return URL.createObjectURL(blob)
  })
}

const imageBox = function(doc, imageName, boxDimensions, options) {
  // helpers.drawGuideBox(boxDimensions)
  options = _.defaults(options, {
    horizontalAlignment: "center",
    verticalAlignment:   "top",
    scaleMode:           "fillToBox"
  })
  let boxRatio = boxDimensions.w / boxDimensions.h

  return fetchImageByName(imageName).then((imageObject) => {
    let imageRatio = imageObject.width / imageObject.height,
      finalX = boxDimensions.x,
      finalY = boxDimensions.y,
      finalW = boxDimensions.w,
      finalH = boxDimensions.h

    if(options.scaleMode == "fillToBox") {
      let canvasImageX = 0,
        canvasImageY = 0,
        canvasImageW = imageObject.width,
        canvasImageH = imageObject.height

      // create a canvas with dimensions matching the image's cropped to the box's ratio
      // add the image to the canvas with these offsets
      // export the canvas as a data URI

      if(imageRatio > boxRatio) { // image is widthier than box
        canvasImageW *= imageRatio/boxRatio
        const widthOffset = imageObject.width - canvasImageW

        // Manage Horizontal Alignment
        if(options.horizontalAlignment == "center") {
          canvasImageX += widthOffset/2

        } else if(options.horizontalAlignment == "right") {
          canvasImageX += widthOffset
        }

      } else { // image is heightier than box
        canvasImageH *= boxRatio/imageRatio
        const heightOffset = imageObject.height - canvasImageH

        // Manage Vertical Alignment
        if(options.verticalAlignment == "middle") {
          canvasImageY += heightOffset/2

        } else if(options.verticalAlignment == "bottom") {
          canvasImageY += heightOffset
        }
      }

      const canvas = document.createElement("canvas"),
        ctx = canvas.getContext("2d")

      canvas.width = imageObject.width
      canvas.height = imageObject.height

      ctx.drawImage(imageObject,
        0, 0, imageObject.width, imageObject.height,
        // 0, 0, imageObject.width, imageObject.height)
        canvasImageX, canvasImageY, canvasImageW, canvasImageH)

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
        imageObject,
        finalX,
        finalY,
        finalW,
        finalH
      )
    }
  })
}

export default {
  render(doc, layer, layerDimensions) {
    let imageName = "",
      { horizontalAlignment, verticalAlignment, imageScaling } = layer

    if(layer.imageNameStatic) {
      imageName = layer.imageName
    } else {
      imageName = `${layer.imageNamePrefix}${helpers.p(layer.imageNameProperty)}${layer.imageNameSuffix}`
    }

    return imageBox(doc, imageName, layerDimensions, { horizontalAlignment, verticalAlignment, scaleMode: imageScaling }).catch(() => {
      console.log(`Failed to add image named "${imageName}"`)
    })
  }
}
