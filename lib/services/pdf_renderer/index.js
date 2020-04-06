import { compact, filter, map, pick, sum } from 'lodash'

import store from '../../store'
import { singlePageDocOfSize } from './document'
import { doLayout } from './layout'
import { renderItem } from './renderer'
import { embedFonts } from './font_embedder'


const publicApi = {
  renderItemToPdf(item, size) {
    const fonts = map(filter(item.layers, { type: "text" }), "font")

    embedFonts(fonts)

    const doc = singlePageDocOfSize(size)
    renderItem(doc, item, size)
    return doc.output('bloburi')
  },

  renderGameToPdf(game) {
    store.dispatch("startNewPrintJob")

    const
      components = store.getters.findAllPrintableGameComponents(game),
      componentSizes = compact(components.map((component) => {
        const template = store.getters.findTemplate(component.templateId)

        return {
          size: template.size,
          name: component.id,
          quantity: store.getters.getComponentItems(component).length
        }
      })),
      printSettings = store.getters.getPrintSettings,
      numComponents = componentSizes.length,
      numItems = sum(map(componentSizes, "quantity")),
      fontsForGame = collapseVariantsIntoFamilies(store.getters.allFontsForGame(game))

    let doc, itemLocations, guideLocations, numPages

    store.dispatch("printJobStatusUpdate", `Preloading Fonts:\n- ${map(fontsForGame, "family").join('\n- ')}`)

    // must preload fonts before creating a doc
    return preloadFonts(fontsForGame)

      // now get the doc and lay out all the components
      .then(() => {
        store.dispatch("printJobStatusUpdate", "Laying out document with components and print settings")
        const layoutObject = doLayout(componentSizes, printSettings)
        doc = layoutObject.doc
        itemLocations = layoutObject.itemLocations
        guideLocations = layoutObject.guideLocations
        numPages = doc.getNumberOfPages()

        store.dispatch("printJobStatusUpdate", `Layout Complete: ${numPages} pages, ${numComponents} components, ${numItems} items`)
      })

      // Render all items into the PDF via the given itemLocations
      .then(() => Promise.each(components, (component) => {
        const items = store.getters.getComponentItems(component)
        store.dispatch("printJobStatusUpdate", `Starting Component: "${component.title}", ${items.length} items`)

        return Promise.each(items, (item, itemIndex, totalItems) => {
          store.dispatch("printJobStatusUpdate", `${component.title} ${itemIndex+1}`)
          let parentDimensions = itemLocations[component.id].shift()

          return renderItem(doc, game, component, item, parentDimensions, itemIndex, totalItems)
        })

      // }).then(() => {
      // TODO: process guideLocations and render cut lines

      }).then(() => {
        const filenameOfDownload = `${game.title || "Game"}.pdf`
        store.dispatch("printJobStatusUpdate", `Finished render, exporting file: ${filenameOfDownload}`)
        return doc.save(filenameOfDownload)

      }).finally(() => store.dispatch("finishPrintJob") ))
  },
}

export default publicApi
