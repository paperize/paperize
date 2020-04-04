import Konva from 'konva'
import { compact, map, reduce, sum } from 'lodash'
// import { findProperty, percentOfParent, scaleDimensions } from '../pdf_renderer/helpers'
//
// import { projectItem } from '../pdf_renderer/item_projector'
//
// import mustache from '../../services/tiny-mustache'
//
//
// // import { findProperty } from './helpers'
// import { getImageById, getImageByName } from '../../services/image_provider'
//
// import store from '../../store'

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
    const nodes = itemsToNodes(items)
    if(nodes.length > 0) {
      layer.add(...nodes)
    }
    // add to the stage, call .draw() or .download() or .exportToDrive()
    stage.draw()
  },

  // items become Konva Groups containing:
  // layers which become Konva primitives (or Groups of primitives!)
  itemsToNodes = (items) => {
    return map(items, (item) => {
      const itemGroup = new Konva.Group()

      itemGroup.add(...map(item.layers, (layer) => {
        return new Konva.Ellipse({
          x: (layer.dimensions.x+layer.dimensions.w/2),
          y: (layer.dimensions.y+layer.dimensions.h/2),
          radius: {
            x: layer.dimensions.w/2,
            y: layer.dimensions.h/2
          },
          fill: 'red',
          stroke: 'black',
          strokeWidth: 4
        })
      }))

      return itemGroup
    })
  }

// const
//   renderShape = (layer, dimensions) => {
//     // early out if no stroke or fill
//     if(!layer.strokePresent && !layer.fillPresent) { return }
//
//     // set stroke settings
//     if(layer.strokePresent) {
//       // Set line width
//       // graphics.lineWidth = layer.strokeWidth * 100
//       // if(layer.shape === "roundedRectangle") { graphics.lineJoin = "round" }
//       const { r: strokeRed, g: strokeGreen, b: strokeBlue } = layer.strokeColor
//       // graphics.strokeStyle = `rgb(${strokeRed}, ${strokeGreen}, ${strokeBlue})`
//     }
//
//     // set fill settings
//     if(layer.fillPresent) {
//       const { r: fillRed, g: fillGreen, b: fillBlue } = layer.fillColor
//       // graphics.fillStyle = `rgb(${fillRed}, ${fillGreen}, ${fillBlue})`
//     }
//
//     // graphics.beginPath()
//     // call appropriate primitive draw function
//     if(layer.shape === "rectangle" || layer.shape === "roundedRectangle") {
//       // graphics.rect(dimensions.x, dimensions.y, dimensions.w, dimensions.h)
//       // graphics.rect(dimensions.x, dimensions.y, dimensions.w, dimensions.h)
//     } else if(layer.shape === "ellipse") {
//       // create our shape
//       return new Konva.Ellipse({
//         x: (dimensions.x+dimensions.w/2),
//         y: (dimensions.y+dimensions.h/2),
//         radius: {
//           x: dimensions.w/2,
//           y: dimensions.h/2
//         },
//         fill: 'red',
//         stroke: 'black',
//         strokeWidth: 4
//       })
//       // graphics.ellipse((dimensions.x+dimensions.w/2), (dimensions.y+dimensions.h/2), dimensions.w/2, dimensions.h/2, 0, 0, 360)
//     } else {
//       throw new Error(`Unknown Shape: ${layer.shape}`)
//     }
//
//     if(layer.fillPresent) {
//       // graphics.fill()
//     }
//
//     if(layer.strokePresent) {
//       // graphics.stroke()
//     }
//   },
//
//   renderText = (layer, dimensions, item) => {
//     const
//       { r: textRed, g: textGreen, b: textBlue } = layer.textColor,
//
//       defaultTemplateVars = {
//         // n0: (index).toString(),
//         // n: (index+1).toString(),
//         // q: total.toString()
//       },
//
//       textContentTemplateVars = reduce(item, (kvObject, itemPair) => {
//         kvObject[itemPair.key] = itemPair.value
//         return kvObject
//       }, defaultTemplateVars),
//
//       contentToRender =layer.textContentTemplate || textContentTemplateVars[layer.name],
//
//       renderedText = contentToRender ? mustache(contentToRender, textContentTemplateVars) : ""
//
//     graphics.fillStyle = `rgb(${textRed}, ${textGreen}, ${textBlue})`
//     graphics.font = `bold ${layer.textSize}px serif`
//     graphics.fillText(renderedText, dimensions.x, dimensions.y+layer.textSize)//, dimensions.w)
//   },
//
//   renderImage = (layer, dimensions, item) => {
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

//   renderItemToKonva(stage, game, component, item, template) {
//     const konvaLayer = new Konva.Layer()
//     stage.add(konvaLayer)
//
//     // add the shape to the layer
//     // konvaLayer.add(circle)
//
//     // renderItemToGraphics(graphics, game, component, item, template) {
//     const
//       layers = store.getters.findAllTemplateLayers(template),
//       selectedLayer = store.getters.activeLayer
//
//     // Prepare the canvas
//     // graphics.clearRect(0, 0, 400, 600)
//
//     // walk the layers
//     return Promise.each(layers, layer => {
//       const
//         layerDimensions = percentOfParent(store.getters.getLayerDimensions(layer), scaleDimensions(template.size, 150)),
//         // Magic properties from the source affect layer defaults
//         projectedLayer = projectItem(layer, item)
//
//       if(!projectedLayer.visible) {
//         return Promise.resolve()
//       }
//
//       // Type-specific layer renderers
//       if(projectedLayer.type == "shape") {
//         let shape = renderShape(projectedLayer, layerDimensions)
//         if(shape){ konvaLayer.add(shape) }
//         return Promise.resolve(shape)
//       } else if(projectedLayer.type == "text") {
//         // return Promise.resolve(konvaLayer.add(renderText(projectedLayer, layerDimensions, item)))
//       } else if(projectedLayer.type == "image") {
//         // return Promise.resolve(konvaLayer.add(renderImage(projectedLayer, layerDimensions, item)))
//       } else {
//         throw new Error(`Unknown Layer Type: ${projectedLayer.type}`)
//       }
//       // return RENDERERS[projectedLayer.type].render(doc, projectedLayer, layerDimensions, item, index, total)
//     })
//
//       .then(() => {
//         konvaLayer.draw()
//       })
//     // apply highlighting
//   },
// }
