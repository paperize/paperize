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

        const pdfDataUri = doc.output('datauri')

        store.dispatch("printJobStatusUpdate", `Finished PDF render, converting to PNG[]`)
        /* globals pdfjsLib */
        return pdfjsLib.getDocument(pdfDataUri).promise.then((pdf) => {
          const
            canvasDiv = document.getElementById('pdf-to-png-canvas-container'),
            totalPages = pdf.numPages,
            pagePromises = []

          for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
            const pagePromise = pdf.getPage(pageNumber).then(page => {
              const
                scale = 2.2, // TODO: set to manage final pixel dimensions?
                viewport = page.getViewport({ scale }),
                canvas = document.createElement('canvas'),
                canvasContext = canvas.getContext('2d'),
                renderContext = { canvasContext, viewport },
                gameTitle = game.title || "Game",
                filenameOfDownload = `${gameTitle} (page ${pageNumber}).png`

              canvasDiv.appendChild(canvas)

              // Prepare canvas using PDF page dimensions
              canvas.height = viewport.height // these affected by scale?
              canvas.width = viewport.width

              // Render PDF page into canvas context
              return page.render(renderContext).promise
                .then(() => canvas.toDataURL('image/png'))
                .then(uri => {
                  const a = document.createElement("a")
                  a.href = uri
                  a.setAttribute("download", filenameOfDownload)
                  a.click()
                })
            })

            // if we want to do something else with the datauris...
            // pagePromises.push(pagePromise)
          }

          // return Promise.all(pagePromises)
        })
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
