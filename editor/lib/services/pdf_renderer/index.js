import { compact, map, sum } from 'lodash'

import store from '../../store'
import { singlePageDocOfSize } from './document'
import { doLayout } from './layout'
import { renderItem } from './renderer'
import { preloadFonts } from './fonts/font_loader'


const publicApi = {
  renderItemToPdf(game, component, item) {
    const
      template = store.getters.findTemplate(component.templateId),
      doc = singlePageDocOfSize(template.size)

    return preloadFonts(store.getters.allFontsForComponent(component))
      .then(() => renderItem(doc, game, component, item, template.size, 0, 1))
      .then(() => doc.output('bloburi'))
  },

  renderGameToPdf(game) {
    store.dispatch("startNewPrintJob")

    const components = store.getters.findAllGameComponents(game),
      componentSizes = compact(components.map((component) => {
        if(!component.templateId) { return null }
        const template = store.getters.findTemplate(component.templateId)
        return {
          size: template.size,
          name: component.id,
          quantity: store.getters.getComponentItems(component).length
        }
      })),
      printSettings = store.getters.getPrintSettings,
      { doc, itemLocations, guideLocations } = doLayout(componentSizes, printSettings),
      numPages = doc.getNumberOfPages(),
      numComponents = componentSizes.length,
      numItems = sum(map(componentSizes, "quantity"))

    store.dispatch("printJobStatusUpdate", `Layout Complete: ${numPages} pages, ${numComponents} components, ${numItems} items`)

    return preloadFonts(store.getters.allFontsForGame(game))
      .then(() => Promise.each(components, (component) => {
      // Render all items into the PDF via the given itemLocations
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
