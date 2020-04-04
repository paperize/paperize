import Konva from 'konva'
import { map } from 'lodash'

export const
  renderItemsToCanvas = (items, canvasId, canvasWidth, canvasHeight) => {
    const
      // Canvas, Dimensions & CSS, Konva.Stage(dimensions)
      stage = new Konva.Stage({
        container: canvasId,
        width: canvasWidth,
        height: canvasHeight
      }),

      layer = new Konva.Layer()

    stage.add(layer)

    // items become Konva Groups and Nodes
    const groups = itemsToGroups(items)
    if(groups.length > 0) {
      layer.add(...groups)
    }
    // add to the stage, call .draw() or .download() or .exportToDrive()
    stage.draw()
  },

  // items become Konva Groups containing:
  // layers which become Konva primitives (or Groups of primitives!)
  itemsToGroups = (items) => {
    return map(items, (item) => {
      const
        itemGroup = new Konva.Group(),
        layerNodes = layersToNodes(item.layers)

      itemGroup.add(...layerNodes)

      return itemGroup
    })
  },

  layersToNodes = (layers) => {
    return map(layers, layerTypeStrategy)
  },

  layerTypeStrategy = (layer) => {
    return strategy("Layer Type", layer.type, {
      "shape": renderShape,
      "text": renderText,
      "image": renderImage,
    })(layer)
  },

  strategy = (strategyName, selection, options) => {
    if(options[selection]) {
      return options[selection]
    } else {
      throw new Error(`Unknown ${strategyName}: ${selection}`)
    }
  },

  renderShape = (layer) => {
    return strategy("Shape", layer.shape, {
      "rectangle": () => {
        return new Konva.Group()
      },

      "roundedRectangle": () => {
        return new Konva.Group()
      },

      "ellipse": () => {
        return new Konva.Ellipse({
          x: (layer.dimensions.x+layer.dimensions.w/2),
          y: (layer.dimensions.y+layer.dimensions.h/2),
          radius: {
            x: layer.dimensions.w/2,
            y: layer.dimensions.h/2
          },
          fill: layer.fillColor,
          stroke: layer.strokeColor,
          strokeWidth: layer.strokeWidth * 150 // FIXME: magic number
        })
      },
    })()
  },
  //   // early out if no stroke or fill
  //   if(!layer.strokePresent && !layer.fillPresent) { return }
  //
  //   // set stroke settings
  //   if(layer.strokePresent) {
  //     // Set line width
  //     // graphics.lineWidth = layer.strokeWidth * 100
  //     // if(layer.shape === "roundedRectangle") { graphics.lineJoin = "round" }
  //     const { r: strokeRed, g: strokeGreen, b: strokeBlue } = layer.strokeColor
  //     // graphics.strokeStyle = `rgb(${strokeRed}, ${strokeGreen}, ${strokeBlue})`
  //   }
  //
  //   // set fill settings
  //   if(layer.fillPresent) {
  //     const { r: fillRed, g: fillGreen, b: fillBlue } = layer.fillColor
  //     // graphics.fillStyle = `rgb(${fillRed}, ${fillGreen}, ${fillBlue})`
  //   }
  //if(layer.shape === "rectangle" || layer.shape === "roundedRectangle") {
  //     // graphics.rect(dimensions.x, dimensions.y, dimensions.w, dimensions.h)
  //     // graphics.rect(dimensions.x, dimensions.y, dimensions.w, dimensions.h)
  //   }
  //
  //   if(layer.fillPresent) {
  //     // graphics.fill()
  //   }
  //
  //   if(layer.strokePresent) {
  //     // graphics.stroke()
  //   }
  // },

  renderText = (layer) => { return new Konva.Group() },
  //   const
  //     { r: textRed, g: textGreen, b: textBlue } = layer.textColor,
  //
  //     defaultTemplateVars = {
  //       // n0: (index).toString(),
  //       // n: (index+1).toString(),
  //       // q: total.toString()
  //     },
  //
  //     textContentTemplateVars = reduce(item, (kvObject, itemPair) => {
  //       kvObject[itemPair.key] = itemPair.value
  //       return kvObject
  //     }, defaultTemplateVars),
  //
  //     contentToRender =layer.textContentTemplate || textContentTemplateVars[layer.name],
  //
  //     renderedText = contentToRender ? mustache(contentToRender, textContentTemplateVars) : ""
  //
  //   graphics.fillStyle = `rgb(${textRed}, ${textGreen}, ${textBlue})`
  //   graphics.font = `bold ${layer.textSize}px serif`
  //   graphics.fillText(renderedText, dimensions.x, dimensions.y+layer.textSize)//, dimensions.w)
  // },

  renderImage = (layer) => { return new Konva.Group() }
//     let { horizontalAlignment, verticalAlignment, imageScaling } = layer,
//       imagePromise
//
//     if(layer.imageNameStatic) {
//       imagePromise = getImageById(layer.imageId)
//     } else {
//       const prefix = layer.imageNamePrefix,
//         property = findProperty(item, layer.imageNameProperty),
//         suffix = layer.imageNameSuffix,
//         imageName = `${prefix}${property}${suffix}`
//
//       imagePromise = getImageByName(imageName)
//     }
//
//     return imagePromise.then((image) => {
//       graphics.drawImage(image, dimensions.x, dimensions.y, dimensions.w, dimensions.h)
//     })
//   },
// }
