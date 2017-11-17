import { find } from 'lodash'
import Promise from 'bluebird'
import jsPDF from 'jspdf'
import store from '../../store'

// To get image data from our local store
let fetchDataByName = function(name) {
  return store.getters.findImageByName(name).then((asset) => asset.data)
}

// To get CORS-enabled images from the web
let toDataURL = function(url) {
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

  renderComponentToPdf(game, component) {
    const doc = this.startNewDocument()
    const items = this.sortItems(component)

    return Promise.each(items, (item) => {
      addPage(doc, template, game)
      return this.renderItem(doc, template, item, items, game)
    }).then(() => {
      return doc.output('bloburi')
    })
  },

  renderGameToPdf(game) {
    const doc = this.startNewDocument()

    const components = this.sortComponents(game)

    return Promise.each(components, (component) => {
      const items = sortItems(component)

      return Promise.each(items, (item) => {
        addPage(doc, template, game)
        return this.renderItem(doc, template, item, items, game)
      })
    }).then(() => {
      return doc.output('bloburi')
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
    doc.addPage(2.5, 3.5)
  },

  sortGameItems(game) {
    // sort game items before iteration, affects printing order
    // let items = game.items.sortBy('order')
    // or default to simple iteration
    return game.items
  },

  renderItem(doc, game, component, item) {
    return Promise.try(() => {
      let left = .20, top = 0
      return Promise.each(item, (property) => {
        top += .20
        if(property.key == "Image") {
          return fetchDataByName(property.value)

          .then((imageDataURI) => {
            return new Promise((resolve, reject) => {
              let image = new Image()
              image.onload = function() {
                doc.addImage(image, 'PNG', left, top, 2, 2)
                console.log('image got added')
                resolve()
              }
              image.src = imageDataURI
            })
          })
        } else {
          doc.setFontSize(10)
          doc.text(`${property.key}: ${property.value}`, left, top)

          return null
        }
      })
    })

    // renderBackgroundTemplates()
    // renderPerPropertyTemplates()
    // renderForegroundTemplates()

    // Do whatever you want here:
    // - write to the pdf with the doc object
    // - doc, game, items, item all in scope, all useful
    // - item is what you're currently drawing
    // - items is the whole collection item is a part of
    // - game is the whole game
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
