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

  return fetchImageByName(imageName).then((imageData) => {
    let imageRatio = imageData.width / imageData.height,
      finalX = boxDimensions.x,
      finalY = boxDimensions.y,
      finalW = boxDimensions.w,
      finalH = boxDimensions.h


    if(options.scaleMode == "fillToBox") {
      if(imageRatio > boxRatio) { // image is widthier than box
        finalW *= imageRatio/boxRatio

        // Manage Horizontal Alignment
        if(options.horizontalAlignment == "center") {
          finalX += (boxDimensions.w - finalW)/2

        } else if(options.horizontalAlignment == "right") {
          finalX += (boxDimensions.w - finalW)
        }

      } else { // image is heightier than box
        finalH *= boxRatio/imageRatio

        // Manage Vertical Alignment
        if(options.verticalAlignment == "middle") {
          finalY += (boxDimensions.h - finalH)/2

        } else if(options.verticalAlignment == "bottom") {
          finalY += boxDimensions.h - finalH
        }
      }
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
    }

    doc.addImage(
      imageData,
      finalX,
      finalY,
      finalW,
      finalH
    )
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
