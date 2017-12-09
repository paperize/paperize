import Promise from 'bluebird'
import jsPDF from 'jspdf'
import store from '../../store'
import _ from 'lodash'

// To get image data from our local store
const fetchDataByName = function(name) {
  return store.getters.findImageByName(name).then(asset => asset.data)
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
    doc.addPage(component.pageSize.w, component.pageSize.h)
  },

  restoreDocumentDefaults(doc) {
    doc.setFontSize(16)
  },

  renderItem(doc, game, component, item) {
    // get transforms for this component
    const transforms = store.getters.getComponentTransforms(component)
    // render each transform upon this item
    console.log(`Rendering ${transforms.length} layers...`)


    let helpers = {
      findProperty(key) {
        return _.find(item, { key }).value || ""
      },

      text(fontSize, text, x, y) {
        doc.setFontSize(fontSize)
        doc.text(text, x, y)
      },

      image(imageName, x, y) {
        return fetchImageByName(imageName).then((image) => {
          doc.addImage(image, x, y)
        })
      }
    }

    helpers.p = helpers.findProperty

    return Promise.each(transforms, transform => {
      this.restoreDocumentDefaults(doc)
      let actualFunction
      // Let the fires of hell erupt
      eval(`actualFunction = function(doc, helpers, dimensions, game, component, item) {
        ${transform.renderFunction}
      }`)

      return actualFunction(doc, helpers, transform.dimensions, game, component, item)
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
