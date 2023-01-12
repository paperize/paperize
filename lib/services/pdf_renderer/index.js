import { compact, map, sum } from 'lodash'

import store from '../../store'
import { singlePageDocOfSize } from './document'
import { doLayout } from './layout'
import { renderItem } from './renderer'
import { preloadFonts } from './fonts/font_loader'

const publicApi = {
  renderItemToPdf: async (game, component, item, template) => {
    let
      doc,
      fontsToLoad = store.getters.allFontsForComponent(component)

    // Collapse variants into unique families and set all variants to "normal"
    fontsToLoad = collapseVariantsIntoFamilies(fontsToLoad)

    try {
      await store.dispatch("startExportItem")
      await preloadFonts(fontsToLoad)
      doc = await singlePageDocOfSize(template.size)
      const results = await renderItem(doc, game, component, item, template.size, 0, 1)
      results.issues.forEach(issue => store.dispatch("exportItemStatusUpdate", issue))
      return doc.output('bloburi')
    } finally {
      store.dispatch("finishExportItem")
    }
  },

  renderGameToPdf(game) {
    store.dispatch("startGameExport")

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

    store.dispatch("exportGameStatusUpdate", `Preloading Fonts:\n- ${map(fontsForGame, "family").join('\n- ')}`)

    // must preload fonts before creating a doc
    return preloadFonts(fontsForGame)

      // now get the doc and lay out all the components
      .then(() => {
        store.dispatch("exportGameStatusUpdate", "Laying out document with components and print settings")
        const layoutObject = doLayout(componentSizes, printSettings)
        doc = layoutObject.doc
        itemLocations = layoutObject.itemLocations
        guideLocations = layoutObject.guideLocations
        numPages = doc.getNumberOfPages()

        store.dispatch("exportGameStatusUpdate", `Layout Complete: ${numPages} pages, ${numComponents} components, ${numItems} items`)
      })

      // Render all items into the PDF via the given itemLocations
      .then(() => Bluebird.each(components, (component) => {
        const items = store.getters.getComponentItems(component)
        store.dispatch("exportGameStatusUpdate", `Starting "${component.title}" (${items.length} items)`)

        return Bluebird.each(items, (item, itemIndex, totalItems) => {
          store.dispatch("exportGameStatusInlineUpdate", itemIndex+1)
          let parentDimensions = itemLocations[component.id].shift()

          return renderItem(doc, game, component, item, parentDimensions, itemIndex, totalItems)
            .then(results => {
              results.issues.forEach(issue => store.dispatch("exportGameStatusUpdate", issue))
            })
        })

        // TODO: cut-lines support by processing guideLocations here

      }).then(() => {
        const filenameOfDownload = `${game.title || "Game"}.pdf`
        store.dispatch("exportGameStatusUpdate", `Finished render, exporting file: "${filenameOfDownload}"`)
        return doc.save(filenameOfDownload)

      }).finally(() => store.dispatch("finishGameExport") ))
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
