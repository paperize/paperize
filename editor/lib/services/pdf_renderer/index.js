import { compact, map, sum } from 'lodash'

import store from '../../store'
import { singlePageDocOfSize } from './document'
import { doLayout } from './layout'
import { renderItem } from './renderer'
import { preloadFonts } from './fonts/font_loader'


const publicApi = {
  renderItemToPdf(game, component, item, template) {
    let doc,
      fontsToLoad = store.getters.allFontsForComponent(component)

    // Collapse variants into unique families and set all variants to "normal"
    fontsToLoad = collapseVariantsIntoFamilies(fontsToLoad)

    return preloadFonts(fontsToLoad)
      .then(() => doc = singlePageDocOfSize(template.size))
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
      numComponents = componentSizes.length,
      numItems = sum(map(componentSizes, "quantity")),
      fontsForGame = collapseVariantsIntoFamilies(store.getters.allFontsForGame(game))

    let doc, itemLocations, guideLocations, numPages

    store.dispatch("printJobStatusUpdate", `Preloading Fonts: ${map(fontsForGame, "family").join(', ')}`)

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

function collapseVariantsIntoFamilies(fonts) {
  return map(fonts, (font) => {
    return {
      family: `${font.family}-${font.variant}`,
      variant: "normal",
      location: font.location
    }
  })
}

export default publicApi
