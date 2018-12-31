import jsPDF from 'jspdf'
import store from '../../store'
import _ from 'lodash'
import { percentOfParent } from './helpers'

// Keep renderers in their own files
import shape from './shape_renderer'
import text from './text_renderer'
import image from './image_renderer'
import code from './code_renderer'

const RENDERERS = { shape, text, image, code }

const api = {
  renderItemToPdf(game, component, item) {
    const doc = this.startNewDocument()
    const template = store.getters.findTemplate(component.templateId)
    this.addPage(doc, template.size)

    return this.renderItem(doc, game, component, item, template.size, 0, 1).then(() => {
      // if(store.getters.activeLayer) {
      //   TODO: render a rectangle around the active layer
      // }

      return doc.output('bloburi')
    })
  },

  renderGameToPdf(game) {
    const doc = this.startNewDocument()
    const components = store.getters.findAllGameComponents(game)

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
      const template = store.getters.findTemplate(component.templateId)
      return {
        size: template.size,
        name: component.id,
        quantity: store.getters.getComponentItems(component).length
      }
    })

    let lastX = marginLeft,
      lastY = marginTop,
      currentPage = 0

    let itemLocations = componentSizes.reduce((locations, { size, name, quantity }) => {
      lastX = marginLeft
      lastY = marginTop
      currentPage += 1
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

      return Promise.each(items, (item, itemIndex, totalItems) => {

        let parentDimensions = itemLocations[component.id].shift()
        // what page is this item's location on?
        doc.setPage(parentDimensions.page)

        return this.renderItem(doc, game, component, item, parentDimensions, itemIndex, totalItems)
      })
    }).then(() => {
      const filenameOfDownload = `${game.title || "Game"}.pdf`
      return doc.save(filenameOfDownload)
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

  renderItem(doc, game, component, item, parentDimensions, index, total) {
    // get layers for this component
    const template = store.getters.findTemplate(component.templateId),
      layers = store.getters.findAllTemplateLayers(template),
      selectedLayer = store.getters.activeLayer

    // render each layer
    return Promise.each(layers, layer => {
      // TODO: modify with layout dimensions
      const layerDimensions = percentOfParent(store.getters.getLayerDimensions(layer), parentDimensions)

      // Always revert to defaults
      this.restoreDocumentDefaults(doc)

      // Type-specific layer renderers
      return RENDERERS[layer.type].render(doc, layer, layerDimensions, item, index, total)
    }).then(() => {
      if(selectedLayer) {
        this.renderHighlightLayer(doc, selectedLayer, parentDimensions)
      }
    })
  },

  renderHighlightLayer(doc, selectedLayer, parentDimensions) {
    const layerDimensions = percentOfParent(store.getters.getLayerDimensions(selectedLayer), parentDimensions),
      // Minimum shape layer needed for a thin, red rectangle
      highlightLayer = {
        shape:         "rectangle",
        strokePresent: true,
        strokeWidth:   0.02,
        strokeColor:   "#CC0000",
        fillPresent:   false,
      }

    RENDERERS.shape.render(doc, highlightLayer, layerDimensions, {}, 0, 0)
  }
}

export default api
