import Promise from 'bluebird'
import jsPDF from 'jspdf'
import store from '../../store'
import _ from 'lodash'
import { percentOfParent } from './helpers'
import shape from './shape_renderer'
import text from './text_renderer'
import image from './image_renderer'
import code from './code_renderer'

const RENDERERS = { shape, text, image, code }

const api = {
  renderItemToPdf(game, component, item) {
    const doc = this.startNewDocument()
    this.addPage(doc, component.template.size)

    return this.renderItem(doc, game, component, item, component.template.size).then(() => {
      // if(store.getters.activeLayer) {
      //   TODO: render a rectangle around the active layer
      // }

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

    let printSettings = store.getters.getPrintSettings,
      pageSize = { w: printSettings.width, h: printSettings.height },
      marginTop = printSettings.marginTop,
      marginRight = printSettings.marginRight,
      marginBottom = printSettings.marginBottom,
      marginLeft = printSettings.marginLeft,
      totalHorizontalMargin = marginLeft + marginRight,
      totalVerticalMargin = marginTop + marginBottom,
      printablePageSize = {
        w: (pageSize.w - totalHorizontalMargin),
        h: (pageSize.h - totalVerticalMargin)
      }

    // TODO: gather all items' layouts
    // generate a layout with locations mapped to dimensions
    let componentSizes = components.map((component) => {
      return {
        size: component.template.size,
        name: component.id,
        quantity: store.getters.getComponentItems(component).length
      }
    })

    let lastX = marginLeft,
      lastY = marginTop,
      currentPage = 1

    let itemLocations = componentSizes.reduce((locations, { size, name, quantity }) => {
      locations[name] = locations[name] || []
      while(quantity > 0){
        let thisX = lastX,
          thisY = lastY

        if(thisX + size.w > printablePageSize.w + marginLeft) {
          // if x is past width (right side of medium page), reset x and increment y
          thisX = lastX = marginLeft
          thisY = lastY = lastY + size.h

          if(thisY + size.h > printablePageSize.h + marginTop) {
            // if y is past height (bottom of medium page), reset y and increment page
            thisY = lastY = marginTop
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
      doc.addPage(pageSize.w, pageSize.h)
    })

    return Promise.each(components, (component) => {
      const items = store.getters.getComponentItems(component)

      return Promise.each(items, (item) => {

        let parentDimensions = itemLocations[component.id].shift()
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
    let layers = store.getters.findAllTemplateLayers(component.template)
    // render each transform upon this item
    console.log(`Rendering ${layers.length} layers...`, layers)

    return Promise.each(layers, layer => {
      // TODO: modify with layout dimensions
      let layerDimensions = percentOfParent(store.getters.getLayerDimensions(layer), parentDimensions)

      // Always revert to defaults
      this.restoreDocumentDefaults(doc)

      return RENDERERS[layer.type].render(doc, layer, layerDimensions, item)
    })
  },
}

export default api
