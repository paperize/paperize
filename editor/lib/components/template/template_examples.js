import Promise from 'bluebird'
import jsPDF from 'jspdf'
import store from '../../store'
import _ from 'lodash'

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

const api = {
  renderItemToPdf(game, component, item) {
    const doc = this.startNewDocument()
    this.addPage(doc, component)

    return this.renderItem(doc, game, component, item).then(() => {
      return doc.output('bloburi')
    })
  },

  // renderComponentToPdf(game, component) {
  //   const doc = this.startNewDocument()
  //   const items = this.sortItems(component)
  //
  //   return Promise.each(items, (item) => {
  //     addPage(doc, template, game)
  //     return this.renderItem(doc, template, item, items, game)
  //   }).then(() => {
  //     return doc.output('bloburi')
  //   })
  // },

  renderGameToPdf(game) {
    const doc = this.startNewDocument()
    const components = game.components // this.sortComponents(game)

    return Promise.each(components, (component) => {
      const items = store.getters.getComponentItems(component)

      return Promise.each(items, (item) => {
        this.addPage(doc, component)
        return this.renderItem(doc, game, component, item)
      })
    }).then(() => {
      return doc.save("game.pdf") //output('bloburi')
    })
  },

  startNewDocument() {
    // Set units
    const doc = new jsPDF({ unit: 'in' })
    // Clear the auto-generated page
    doc.deletePage(1)

    return doc
  },

  addPage(doc, component) {
    // game or template knows page settings?
    // template.pageArguments?
    // doc.apply('addPage', template.pageArguments)
    doc.addPage(component.template.size.w, component.template.size.h)
  },

  restoreDocumentDefaults(doc) {
    doc.setFontSize(16)
    doc.setLineWidth(.02)
    doc.setDrawColor(0)
    doc.setFillColor(0)
  },

  renderItem(doc, game, component, item) {
    // get transforms for this component
    let layers = store.getters.getTemplateLayers(component.template)
    // render each transform upon this item
    console.log(`Rendering ${layers.length} layers...`, layers)


    let helpers = {
      findProperty(key) {
        const property = _.find(item, { key })
        if(property) {
          return property.value
        } else {
          console.error(`No property found by key: ${key}`)
          return ""
        }
      },

      percentOfParent(dimensions, parent) {
        return {
          x: dimensions.x*.01*parent.w,
          y: dimensions.y*.01*parent.h,
          w: dimensions.w*.01*parent.w,
          h: dimensions.h*.01*parent.h,
        }
      },

      // easy to render a rect given dimensions
      easyRect(dimensions, mode="S") {
        doc.rect(dimensions.x, dimensions.y, dimensions.w, dimensions.h, mode)
        // doc.roundedRect(dimensions.x, dimensions.y, dimensions.w, dimensions.h, .1, .1, mode)
      },

      text(fontSize, text, x, y) {
        doc.setFontSize(fontSize)
        doc.text(text, x, y)
      },

      textBox(text, boxDimensions, options) {
        options = _.defaults(options, {})
        // helpers.drawGuideBox(boxDimensions)

        // Line Height Formula: fontSize * lineHeight / ptsPerInch
        let oneLineHeight = doc.internal.getFontSize() * 1.2 / 72,
          finalX = boxDimensions.x,
          finalY = boxDimensions.y + oneLineHeight

        text = doc.splitTextToSize(text, boxDimensions.w)
        doc.text(text, finalX, finalY, options.align)
      },

      imageBox(imageName, boxDimensions, options) {
        // helpers.drawGuideBox(boxDimensions)
        options = _.defaults(options, {
          horizontalAlignment: "center",
          verticalAlignment: "top"
        })
        let boxRatio = boxDimensions.w / boxDimensions.h

        return fetchImageByName(imageName).then((imageData) => {
          let imageRatio = imageData.width / imageData.height,
            finalX = boxDimensions.x,
            finalY = boxDimensions.y,
            finalW = boxDimensions.w,
            finalH = boxDimensions.h

          // TODO: Fill to Box

          // Fit to Box
          if(imageRatio > boxRatio) {
            // Squeeze Height
            finalH *= boxRatio/imageRatio

            // Manage Vertical Alignment
            if(options.verticalAlignment == "middle") {
              finalY += (boxDimensions.h - finalH)/2
            } else if(options.verticalAlignment == "bottom") {
              finalY += boxDimensions.h - finalH
            }

          } else {
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
            imageData,
            finalX,
            finalY,
            finalW,
            finalH
          )
        })
      }
    }

    helpers.p = helpers.findProperty

    return Promise.each(layers, layer => {
      let layerDimensions = helpers.percentOfParent(store.getters.getLayerDimensions(layer), component.template.size)

      // Always revert to defaults
      this.restoreDocumentDefaults(doc)

      // Draw a helper rectangle
      // TODO: draw based on dimensions.mode
      doc.setLineWidth(.005)
      helpers.easyRect(layerDimensions)

      if(layer.type == "code" && layer.renderFunction) {
        let actualFunction
        // Let the fires of hell erupt
        eval(`actualFunction = function(doc, helpers, dimensions, game, component, item) {
          ${layer.renderFunction}
        }`)
        return actualFunction(doc, helpers, layerDimensions, game, component, item)

      } else if(layer.type == "shape") {
        // extract RGB255 from hex
        let redFillComponent = parseInt(`${layer.fillColor[1]}${layer.fillColor[2]}`, 16),
          greenFillComponent = parseInt(`${layer.fillColor[3]}${layer.fillColor[4]}`, 16),
          blueFillComponent  = parseInt(`${layer.fillColor[5]}${layer.fillColor[6]}`, 16),
          redStrokeComponent = parseInt(`${layer.strokeColor[1]}${layer.strokeColor[2]}`, 16),
          greenStrokeComponent = parseInt(`${layer.strokeColor[3]}${layer.strokeColor[4]}`, 16),
          blueStrokeComponent  = parseInt(`${layer.strokeColor[5]}${layer.strokeColor[6]}`, 16)

        doc.setFillColor(redFillComponent, greenFillComponent, blueFillComponent)
        doc.setDrawColor(redStrokeComponent, greenStrokeComponent, blueStrokeComponent)
        doc.setLineWidth(layer.strokeWidth)

        if(layer.strokePresent && layer.fillPresent) {
          helpers.easyRect(layerDimensions, "DF")
        } else if(layer.strokePresent) {
          helpers.easyRect(layerDimensions, "S")
        } else if(layer.fillPresent) {
          helpers.easyRect(layerDimensions, "F")
        }

      } else if(layer.type == "text") {
        doc.setFontSize(8)

        let propertyText = _.reduce(item, (text, itemPair) => {
          text += `${itemPair.key}: ${itemPair.value}\n`
          return text
        }, "")
        helpers.textBox(propertyText, layerDimensions, {})

      } else if(layer.type == "image") {
        let imageName = "",
          { horizontalAlignment, verticalAlignment } = layer

        if(layer.imageNameStatic) {
          imageName = layer.imageName
        } else {
          imageName = `${layer.imageNamePrefix}${helpers.p(layer.imageNameProperty)}${layer.imageNameSuffix}`
        }

        return helpers.imageBox(imageName, layerDimensions, { horizontalAlignment, verticalAlignment }).catch(() => {
            console.error(`Failed to add image named "${imageName}"`)
          })
      }
    })
  },

  renderBackgroundTemplates() {

  },

  renderPerPropertyTemplates() {

  },

  renderForegroundTemplates() {

  },
}

export default api

// Ideas for per-property templates
// propertyTemplate("title", (title, doc) => {
//   failUnless("text")
//
//   doc.setColor(color)
//   doc.setFont(font)
//   doc.renderText(title, x, y)
// })
//
// propertyTemplate("cost", (cost, doc) => {
//   failUnless("template")
//
//   doc.setColor(color)
//   doc.setFont(font)
//   doc.renderText(cost(), x, y)
// })
//
// propertyTemplate("image", (image, doc) => {
//   failUnless("image")
//
//   // implement stretch/crop to fit/fill
//
//   doc.addImage(image, x, y)
// })
