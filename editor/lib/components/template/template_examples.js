import Promise from 'bluebird'
import jsPDF from 'jspdf'
import store from '../../store'
import _ from 'lodash'
import mustache from '../../services/tiny-mustache'

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
    this.addPage(doc, component.template.size)

    return this.renderItem(doc, game, component, item, component.template.size).then(() => {
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
    const components = game.components

    let pageSize = { h: 8.5, w: 11 },
      defaultMargin = .25

    // TODO: gather all items' layouts
    // generate a layout with locations mapped to dimensions
    let componentSizes = components.map((component) => {
      return {
        size: component.template.size,
        name: component.id,
        quantity: store.getters.getComponentItems(component).length
      }
    })

    let lastX = defaultMargin,
      lastY = defaultMargin,
      currentPage = 1

    let itemLocations = componentSizes.reduce((locations, { size, name, quantity }) => {
      locations[name] = locations[name] || []
      while(quantity > 0){
        let thisX = lastX,
          thisY = lastY

        if(thisX + size.w > (pageSize.w - defaultMargin*2)) {
          // if x is past width (right side of medium page), reset x and increment y
          thisX = lastX = defaultMargin
          thisY = lastY = lastY + size.h

          if(thisY + size.h > (pageSize.h - defaultMargin*2)) {
            // if y is past height (bottom of medium page), reset y and increment page
            thisY = lastY = defaultMargin
            currentPage += 1
          }

          // TODO: "rasturbate mode"
          // TODO: component is larger than the physical page itself and must
          //  be striped across multiple physical pages and reconstructed at
          //  "PnP-time" (vs "Data-time", "Print-time", etc?)
        }

        locations[name].push({
          ...size,
          page: currentPage,
          x: thisX, y: thisY
        })
        lastX += size.w
        quantity -= 1
      }

      return locations
    }, {})

    // Add all needed pages to doc up front
    _.times(currentPage, () => {
      doc.addPage(pageSize.w-defaultMargin*2, pageSize.h-defaultMargin*2)
    })

    return Promise.each(components, (component) => {
      const items = store.getters.getComponentItems(component)

      return Promise.each(items, (item) => {

        let parentDimensions = itemLocations[component.id].pop()
        // what page is this item's location on?
        doc.setPage(parentDimensions.page)

        return this.renderItem(doc, game, component, item, parentDimensions)
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

  addPage(doc, size) {
    // game or template knows page settings?
    // template.pageArguments?
    // doc.apply('addPage', template.pageArguments)
    doc.addPage(size.w, size.h)
  },

  restoreDocumentDefaults(doc) {
    doc.setFontSize(16)
    doc.setLineWidth(.02)
    doc.setDrawColor(0)
    doc.setFillColor(0)
  },

  renderItem(doc, game, component, item, parentDimensions) {
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
          console.log(`No property found by key: ${key}`)
          return ""
        }
      },

      percentOfParent(dimensions, parent) {
        return {
          x: (dimensions.x*.01*parent.w)+(parent.x || 0),
          y: (dimensions.y*.01*parent.h)+(parent.y || 0),
          w: dimensions.w*.01*parent.w,
          h: dimensions.h*.01*parent.h,
        }
      },

      hexToRGB(hexColorString) {
        let r = parseInt(`${hexColorString[1]}${hexColorString[2]}`, 16),
          g = parseInt(`${hexColorString[3]}${hexColorString[4]}`, 16),
          b = parseInt(`${hexColorString[5]}${hexColorString[6]}`, 16)

        return { r, g, b }
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
      // TODO: modify with layout dimensions
      let layerDimensions = helpers.percentOfParent(store.getters.getLayerDimensions(layer), parentDimensions)

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
        let { r: fr, g: fg, b: fb } = helpers.hexToRGB(layer.fillColor)
        doc.setFillColor(fr, fg, fb)
        let { r: sr, g: sg, b: sb } = helpers.hexToRGB(layer.strokeColor)
        doc.setDrawColor(sr, sg, sb)
        doc.setLineWidth(layer.strokeWidth)

        if(layer.strokePresent && layer.fillPresent) {
          helpers.easyRect(layerDimensions, "DF")
        } else if(layer.strokePresent) {
          helpers.easyRect(layerDimensions, "S")
        } else if(layer.fillPresent) {
          helpers.easyRect(layerDimensions, "F")
        }

      } else if(layer.type == "text") {
        doc.setFontSize(layer.textSize)
        let { r, g, b } = helpers.hexToRGB(layer.textColor)
        doc.setTextColor(r, g, b)

        // List Properties template:
        // let propertyText = _.reduce(item, (text, itemPair) => {
        //   text += `${itemPair.key}: ${itemPair.value}\n`
        //   return text
        // }, "")

        // Prepare template variables
        let textContentTemplateVars = _.reduce(item, (kvObject, itemPair) => {
          kvObject[itemPair.key] = itemPair.value
          return kvObject
        }, {})

        // Render the template
        // Allow multiple render passes?
        // Check for templates that call themselves?
        // Check for circular dependencies?
        let textContentTemplate = mustache(layer.textContentTemplate, textContentTemplateVars)

        helpers.textBox(textContentTemplate, layerDimensions, {})

      } else if(layer.type == "image") {
        let imageName = "",
          { horizontalAlignment, verticalAlignment } = layer

        if(layer.imageNameStatic) {
          imageName = layer.imageName
        } else {
          imageName = `${layer.imageNamePrefix}${helpers.p(layer.imageNameProperty)}${layer.imageNameSuffix}`
        }

        return helpers.imageBox(imageName, layerDimensions, { horizontalAlignment, verticalAlignment }).catch(() => {
            console.log(`Failed to add image named "${imageName}"`)
          })
      }
    })
  },
}

export default api
