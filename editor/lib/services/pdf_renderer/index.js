import jsPDF from 'jspdf'
import store from '../../store'
import _ from 'lodash'
import { percentOfParent } from './helpers'
import { MODE_AUTO_LAYOUT, MODE_COMPONENT_PER_PAGE } from '../../store/print'

// Keep renderers in their own files
import shape from './shape_renderer'
import text from './text_renderer'
import image from './image_renderer'

const RENDERERS = { shape, text, image }

const publicApi = {
    renderItemToPdf(game, component, item) {
      const template = store.getters.findTemplate(component.templateId)
      const doc = documentApi.singlePageDocOfSize(template.size)

      return renderApi.renderItem(doc, game, component, item, template.size, 0, 1).then(() => {
        return doc.output('bloburi')
      })
    },

    renderGameToPdf(game) {
      store.dispatch("startNewPrintJob")

      const components = store.getters.findAllGameComponents(game),
        componentSizes = _.compact(components.map((component) => {
          if(!component.templateId) { return null }
          const template = store.getters.findTemplate(component.templateId)
          return {
            size: template.size,
            name: component.id,
            quantity: store.getters.getComponentItems(component).length
          }
        })),
        printSettings = store.getters.getPrintSettings,
        { doc, itemLocations } = layoutApi.doLayout(componentSizes, printSettings),
        numPages = doc.getNumberOfPages(),
        numComponents = componentSizes.length,
        numItems = _.sum(_.map(componentSizes, "quantity"))

      store.dispatch("printJobStatusUpdate", `Layout Complete: ${numPages} pages, ${numComponents} components, ${numItems} items`)
      return Promise.each(components, (component) => {
        const items = store.getters.getComponentItems(component)
        store.dispatch("printJobStatusUpdate", `Starting Component: "${component.title}", ${items.length} items`)

        return Promise.each(items, (item, itemIndex, totalItems) => {
          store.dispatch("printJobStatusUpdate", `${component.title} ${itemIndex+1}`)
          let parentDimensions = itemLocations[component.id].shift()
          // what page is this item's location on?
          doc.setPage(parentDimensions.page)

          return renderApi.renderItem(doc, game, component, item, parentDimensions, itemIndex, totalItems)
        })
      }).then(() => {
        const filenameOfDownload = `${game.title || "Game"}.pdf`
        store.dispatch("printJobStatusUpdate", `Finished render, exporting file: ${filenameOfDownload}`)
        return doc.save(filenameOfDownload)
      }).finally(() => {
        store.dispatch("finishPrintJob")
      })
    },
  },

  layoutApi = {
    doLayout(componentSizes, printSettings) {
      const doc = documentApi.startEmptyDocument()
      let itemLocations
      if(printSettings.mode == MODE_AUTO_LAYOUT) {
        itemLocations = this.autoLayoutItems(doc, componentSizes, printSettings)
      } else if(printSettings.mode == MODE_COMPONENT_PER_PAGE) {
        itemLocations = this.componentPerPageItemLayout(doc, componentSizes, printSettings)
      }

      return { doc, itemLocations }
    },

    autoLayoutItems(doc, componentSizes, printSettings) {
      const pageSize = {
          w: printSettings.width,
          h: printSettings.height
        },
        { marginTop, marginRight, marginBottom, marginLeft } = printSettings,
        totalHorizontalMargin = marginLeft + marginRight,
        totalVerticalMargin = marginTop + marginBottom,
        printablePageSize = {
          w: (pageSize.w - totalHorizontalMargin),
          h: (pageSize.h - totalVerticalMargin)
        }

      let
        lastX = marginLeft,
        lastY = marginTop,
        currentPage = 0,
        itemLocations = componentSizes.reduce((locations, { size, name, quantity }) => {
          lastX = marginLeft
          lastY = marginTop
          // new page on new component
          // TODO: "component mingling" print setting, for the paper-conscious
          currentPage += 1
          // make sure there's
          locations[name] = locations[name] || []
          // once per item
          while(quantity > 0){
            let thisX = lastX,
              thisY = lastY

            if(thisX + size.w > printablePageSize.w + marginLeft) {
              // new row detected
              // if x is past width (right side of medium page), reset x and increment y
              thisX = lastX = marginLeft
              thisY = lastY = lastY + size.h

              if(thisY + size.h > printablePageSize.h + marginTop) {
                // new page detected
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
              page: currentPage,
              ...size, // { w, h }
              x: thisX, y: thisY
            })

            lastX += size.w
            quantity -= 1
          }

          return locations
        }, {})

      // Add all needed pages to doc
      _.times(currentPage, () => {
        doc.addPage([pageSize.w, pageSize.h])
      })

      return itemLocations
    },

    componentPerPageItemLayout(doc, componentSizes) {
      let currentPage = 0
      return componentSizes.reduce((locations, { size, name, quantity }) => {
        // initialize a slot for this collection of components
        locations[name] = locations[name] || []
        // execute once per item
        _.times(quantity,() => {
          // add a page to the doc of the exact size (no margins)
          doc.addPage([size.w, size.h])
          // bump the page number
          currentPage += 1
          // add an item location...
          locations[name].push({
            ...size,
            page: currentPage, // ...on the new page number...
            x: 0, // ...at the top left
            y: 0
          })
        })
        return locations
      }, {})
    },
  },

  documentApi = {
    singlePageDocOfSize(size) {
      const doc = this.startEmptyDocument()

      doc.addPage([size.w, size.h])

      return doc
    },

    startEmptyDocument() {
      // Set units
      const doc = new jsPDF({ unit: 'in' })
      // Clear the auto-generated page
      doc.deletePage(1)

      return doc
    },
  },

  renderApi = {
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
        this.layerDefaults(doc)

        // Type-specific layer renderers
        return RENDERERS[layer.type].render(doc, layer, layerDimensions, item, index, total)
      }).then(() => {
        if(selectedLayer && store.getters.layerHighlighting) {
          this.renderHighlightLayer(doc, selectedLayer, parentDimensions)
        }
      })
    },

    layerDefaults(doc) {
      doc.setFontSize(16)
      doc.setLineWidth(.02)
      doc.setDrawColor(0)
      doc.setFillColor(0)
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

export default publicApi
