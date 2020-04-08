import { compact, concat, each, filter, flatten, map, uniqBy } from 'lodash'

// import store from '../../store'
import { singlePageDocOfSize, startEmptyDocument } from './document'
import { renderItem } from './renderer'
import { embedFonts } from './font_embedder'

// item in, array of fonts out
const itemFonts = (item) => map(filter(item.layers, { type: "text" }), "font")
// game in, array of fonts out
const gameFonts = (game) => uniqBy(flatten(map(game.items, itemFonts)), "location")
// game in, array of page sizes out [{w, h}...]
const gamePages = (game) => {
  const
    // items appearing many-to-a-page are filtered down to unique pages
    singlePageItemPages = map(uniqBy(compact(map(game.items, "location")), "page"), "pageSize"),
    // items appearing on multiple pages must define multiple pages each
    multiPageItemPages = map(flatten(compact(map(game.items, "locations"))), "pageSize")

  return concat(singlePageItemPages, multiPageItemPages)
}

const
  renderItemToPdf = (item) => {
    // pluck the font objects, only from the text layers
    const fonts = itemFonts(item)
    // make sure jsPDF has the required fonts embedded
    embedFonts(fonts)

    const doc = singlePageDocOfSize(item.size)
    renderItem(doc, item)
    return doc.output('bloburi')
  },

  renderGameToPdf = (game) => {
    const
      doc = startEmptyDocument(),
      fonts = gameFonts(game),
      pages = gamePages(game),
      filenameOfDownload = `${game.title || "Game"}.pdf`

    // embed the needed fonts into the pdf
    embedFonts(fonts)

    // add each page to the document with the appropriate size
    each(pages, ({ w, h}) => {
      doc.addPage([w, h])
    })

    // render each item. items know where they are on which page
    each(game.items, (item) => {
      renderItem(doc, item)
    })

    return doc.save(filenameOfDownload)
  }

export default { renderItemToPdf, renderGameToPdf }
