import { each, filter, map, uniqBy } from 'lodash'

// import store from '../../store'
import { singlePageDocOfSize, startEmptyDocument } from './document'
import { renderItem } from './renderer'
import { embedFonts } from './font_embedder'


const renderItemToPdf = (item) => {
    // pluck the font objects, only from the text layers
    const fonts = map(filter(item.layers, { type: "text" }), "font")
    // make sure jsPDF has the required fonts embedded
    embedFonts(fonts)

    const doc = singlePageDocOfSize(item.size)
    renderItem(doc, item)
    return doc.output('bloburi')
  },

  renderGameToPdf = (game) => {
    // store.dispatch("startNewPrintJob")

    const doc = startEmptyDocument()

    // store.dispatch("printJobStatusUpdate", `Preloading Fonts:\n- ${map(fontsForGame, "family").join('\n- ')}`)
    // TODO: lookup and embed all fonts

    // store.dispatch("printJobStatusUpdate", "Laying out document with components and print settings")
    // grab the page sizes of unique pages
    const pageSizes = map(uniqBy(game.items, "location.page"), "location.pageSize")
    // add each page to the document with the appropriate size
    each(pageSizes, ({ w, h}) => {
      doc.addPage([w, h])
    })

    // const numPages = doc.getNumberOfPages()
    // store.dispatch("printJobStatusUpdate", `Layout Complete: ${numPages} pages, ${numComponents} components, ${numItems} items`)

    // store.dispatch("printJobStatusUpdate", `Starting Component: "${component.title}", ${items.length} items`)
    // each(game.components, (component) => {
    //
    // })

    each(game.items, (item) => {
      // store.dispatch("printJobStatusUpdate", `${component.title} ${itemIndex+1}`)
      // TODO: apply layout now, item knows its own dimenions?
      renderItem(doc, item)
    })

    // store.dispatch("printJobStatusUpdate", `Finished render, exporting file: ${filenameOfDownload}`)
    const
      filenameOfDownload = `${game.title || "Game"}.pdf`,
      downloadableFile = doc.save(filenameOfDownload)

    // store.dispatch("finishPrintJob")

    return downloadableFile
  }

export default { renderItemToPdf, renderGameToPdf }
