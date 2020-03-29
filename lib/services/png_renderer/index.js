import { compact, map, reduce, sum } from 'lodash'
import { findProperty, percentOfParent, scaleDimensions } from '../pdf_renderer/helpers'

import { projectItem } from '../pdf_renderer/item_projector'

import mustache from '../../services/tiny-mustache'


// import { findProperty } from './helpers'
import { getImageById, getImageByName } from '../../services/image_provider'

import store from '../../store'

const
  renderShape = (graphics, layer, dimensions) => {
    // early out if no stroke or fill
    if(!layer.strokePresent && !layer.fillPresent) { return }

    // set stroke settings
    if(layer.strokePresent) {
      // Set line width
      graphics.lineWidth = layer.strokeWidth * 100
      if(layer.shape === "roundedRectangle") { graphics.lineJoin = "round" }
      const { r: strokeRed, g: strokeGreen, b: strokeBlue } = layer.strokeColor
      graphics.strokeStyle = `rgb(${strokeRed}, ${strokeGreen}, ${strokeBlue})`
    }

    // set fill settings
    if(layer.fillPresent) {
      const { r: fillRed, g: fillGreen, b: fillBlue } = layer.fillColor
      graphics.fillStyle = `rgb(${fillRed}, ${fillGreen}, ${fillBlue})`
    }

    graphics.beginPath()
    // call appropriate primitive draw function
    if(layer.shape === "rectangle" || layer.shape === "roundedRectangle") {
      graphics.rect(dimensions.x, dimensions.y, dimensions.w, dimensions.h)
      graphics.rect(dimensions.x, dimensions.y, dimensions.w, dimensions.h)
    } else if(layer.shape === "ellipse") {
      graphics.ellipse((dimensions.x+dimensions.w/2), (dimensions.y+dimensions.h/2), dimensions.w/2, dimensions.h/2, 0, 0, 360)
    } else {
      throw new Error(`Unknown Shape: ${layer.shape}`)
    }

    if(layer.fillPresent) {
      graphics.fill()
    }

    if(layer.strokePresent) {
      graphics.stroke()
    }
  },

  renderText = (graphics, layer, dimensions, item) => {
    const
      { r: textRed, g: textGreen, b: textBlue } = layer.textColor,

      defaultTemplateVars = {
        // n0: (index).toString(),
        // n: (index+1).toString(),
        // q: total.toString()
      },

      textContentTemplateVars = reduce(item, (kvObject, itemPair) => {
        kvObject[itemPair.key] = itemPair.value
        return kvObject
      }, defaultTemplateVars),

      contentToRender =layer.textContentTemplate || textContentTemplateVars[layer.name],

      renderedText = contentToRender ? mustache(contentToRender, textContentTemplateVars) : ""

    graphics.fillStyle = `rgb(${textRed}, ${textGreen}, ${textBlue})`
    graphics.font = `bold ${layer.textSize}px serif`
    graphics.fillText(renderedText, dimensions.x, dimensions.y+layer.textSize)//, dimensions.w)
  },

  renderImage = (graphics, layer, dimensions, item) => {
    let { horizontalAlignment, verticalAlignment, imageScaling } = layer,
      imagePromise

    if(layer.imageNameStatic) {
      imagePromise = getImageById(layer.imageId)
    } else {
      const prefix = layer.imageNamePrefix,
        property = findProperty(item, layer.imageNameProperty),
        suffix = layer.imageNameSuffix,
        imageName = `${prefix}${property}${suffix}`

      imagePromise = getImageByName(imageName)
    }

    return imagePromise.then((image) => {
      graphics.drawImage(image, dimensions.x, dimensions.y, dimensions.w, dimensions.h)
    })
  },

  publicApi = {
    renderItemToGraphics(graphics, game, component, item, template) {
      const
        layers = store.getters.findAllTemplateLayers(template),
        selectedLayer = store.getters.activeLayer

      // Prepare the canvas
      graphics.clearRect(0, 0, 400, 600)

      // walk the layers
      return Promise.each(layers, layer => {
        const
          layerDimensions = percentOfParent(store.getters.getLayerDimensions(layer), scaleDimensions(template.size, 150)),
          // Magic properties from the source affect layer defaults
          projectedLayer = projectItem(layer, item)

        if(!projectedLayer.visible) {
          return Promise.resolve()
        }

        // Type-specific layer renderers
        if(projectedLayer.type == "shape") {
          return Promise.resolve(renderShape(graphics, projectedLayer, layerDimensions))
        } else if(projectedLayer.type == "text") {
          return Promise.resolve(renderText(graphics, projectedLayer, layerDimensions, item))
        } else if(projectedLayer.type == "image") {
          return Promise.resolve(renderImage(graphics, projectedLayer, layerDimensions, item))
        } else {
          throw new Error(`Unknown Layer Type: ${projectedLayer.type}`)
        }
        // return RENDERERS[projectedLayer.type].render(doc, projectedLayer, layerDimensions, item, index, total)
      })
      // apply highlighting
    },
  }

export default publicApi
