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
    // early out if no stroke or fill
    if(!layer.strokePresent && !layer.fillPresent) { return new Konva.Group() }

    const konvaShape = strategy("Shape", layer.shape, {
      "rectangle": () => {
        return new Konva.Rect({
          x: layer.dimensions.x,
          y: layer.dimensions.y,
          width: layer.dimensions.w,
          height: layer.dimensions.h,
        })
      },

      "roundedRectangle": () => {
        return new Konva.Rect({
          x: layer.dimensions.x,
          y: layer.dimensions.y,
          width: layer.dimensions.w,
          height: layer.dimensions.h,
          cornerRadius: 15,
        })
      },

      "ellipse": () => {
        return new Konva.Ellipse({
          x: (layer.dimensions.x+layer.dimensions.w/2),
          y: (layer.dimensions.y+layer.dimensions.h/2),
          radius: {
            x: layer.dimensions.w/2,
            y: layer.dimensions.h/2
          },
        })
      },
    })()

    if(layer.strokePresent) {
      konvaShape.stroke(layer.strokeColor)
      konvaShape.strokeWidth(layer.strokeWidth * 150) // FIXME: magic number
    }

    if(layer.fillPresent) {
      konvaShape.fill(layer.fillColor)
    }

    return konvaShape
  },

  renderText = (layer) => {
    // TODO: font face, variant, size
    return new Konva.Text({
      text: layer.renderedText,
      x: layer.dimensions.x,
      y: layer.dimensions.y,
      width: layer.dimensions.w,
      height: layer.dimensions.h,
      fontSize: layer.textSize,
      fill: layer.textColor,
      align: layer.horizontalAlignment,
      verticalAlign: layer.verticalAlignment
    })
  },

  renderImage = (layer) => {
    // TODO: alignment and shrink/stretch
    // const { horizontalAlignment, verticalAlignment, imageScaling } = layer
    return new Konva.Image({
      image: layer.image,
      x: layer.dimensions.x,
      y: layer.dimensions.y,
      width: layer.dimensions.w,
      height: layer.dimensions.h,
    })
  }
