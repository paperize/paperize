import { RENDER_TARGET, DEFAULT_PAGE_OPTIONS, DEFAULT_RENDER_OPTIONS, DEFAULT_RASTER_OPTIONS } from './options'
import { convert, INCHES, PIXELS, DEFAULT_UNIT_OPTIONS } from '../../util/units'

// paperize
import store from '../../store'
import { map } from "bluebird";

import jsPDF from '../../jspdf';

/**************/
/* PUBLIC API */
/**************/

/**
 * Renders element(s) using the format specified by `options.renderTarget` 
 * (default is `RENDER_TARGET.SVG`). At least one of `options.item`, 
 * `options.items`, `options.component`, `options.components`, or `options.game`
 * must be defined.
 * 
 * @param {*} options.item A single item. Requires at least one of `options.component` or `options.template` to be defined.
 * @param {*} options.items An array of items. Requires at least one of `options.component` or `options.template` to be defined.
 *
 * @returns a blob url or array of blob urls of the rendered element(s).
 */
export async function render(options) {
  options = { ... DEFAULT_RENDER_OPTIONS, ...options }
       if(options.item      ) return await renderItem      (options)
  else if(options.items     ) return await renderItems     (options)
  else if(options.component ) return await renderComponent (options)
  else if(options.components) return await renderComponents(options)
  else if(options.game      ) return await renderGame      (options)
  throw `[render] At least one of 'options.item', 'options.items', 'options.component', 'options.components', or 'options.game' must be defined!`
}

/**
 * Renders a single item using the format specified by `options.renderTarget` 
 * (default is `RENDER_TARGET.SVG`). Requires `options.item` AND at least one of
 * `options.component` or `options.template` to be defined.
 * 
 * @returns a blob url of the rendered item.
 */
export async function renderItem (options) {
  options = { ...DEFAULT_RENDER_OPTIONS, ...options }

  if(!options.item                          ) 
    throw `[renderItem] 'options.item' must be defined!`
  if(!options.component && !options.template)
     throw `[renderItem] At least one of 'options.component' or 'options.template' must be defined!`

  options.template = options.template || store.getters.findComponentTemplate(options.component)

  switch(options.renderTarget) {
    case RENDER_TARGET.SVG: return                      await _renderItem (options)
    case RENDER_TARGET.JPG: return await _svgToRaster  (await _renderItem (options))
    case RENDER_TARGET.PNG: return await _svgToRaster  (await _renderItem (options))
    case RENDER_TARGET.PDF: return await _svgToDocument(await _renderItem (options))
  }

  throw `[renderItem] Unsupported render target '${options.renderTarget}'`
}

/**
 * Renders item(s) using the format specified by `options.renderTarget` 
 * (default is `RENDER_TARGET.SVG`). Requires at least one of `options.items` or
 * `options.item` AND at least one of `options.component` or `options.template` 
 * to be defined.
 * @returns a blob url or array of blob urls of the rendered item(s).
 */
export async function renderItems(options) {
  options = { ...DEFAULT_RENDER_OPTIONS, ...options }

  if(!options.items     && !options.item    ) 
    throw `[renderItems] At least one of 'options.items' or 'options.item' must be defined!`
  if(!options.component && !options.template) 
    throw `[renderItems] At least one of 'options.component' or 'options.template' must be defined!`

  options.items    = options.items    || [ options.item ]
  options.template = options.template || store.getters.findComponentTemplate(options.component)

  switch(options.renderTarget) {
    case RENDER_TARGET.SVG: return                      await _renderItems(options)
    case RENDER_TARGET.JPG: return await _svgToRaster  (await _renderItems(options))
    case RENDER_TARGET.PNG: return await _svgToRaster  (await _renderItems(options))
    case RENDER_TARGET.PDF: return await _svgToDocument(await _renderItems(options))
  }

  throw `[renderItems] Unsupported render target '${options.renderTarget}'`
}


/**
 * Renders a single component using the format specified by 
 * `options.renderTarget` (default is `RENDER_TARGET.SVG`). Requires 
 * `options.component` to be defined.
 * @returns a blob url or array of blob urls of the rendered component.
 */
export async function renderComponent (options) {
  options = { ...DEFAULT_RENDER_OPTIONS, ...options }

  if(!options.component) 
    throw `[renderComponent] 'options.component' must be defined!`

  options.items    = options.items || [ options.item ] || store.getters.getComponentItems    (options.component)
  options.template = options.template                  || store.getters.findComponentTemplate(options.component)

  switch(options.renderTarget) {
    case RENDER_TARGET.SVG: return                      await _renderComponent (options)
    case RENDER_TARGET.JPG: return await _svgToRaster  (await _renderComponent (options))
    case RENDER_TARGET.PNG: return await _svgToRaster  (await _renderComponent (options))
    case RENDER_TARGET.PDF: return await _svgToDocument(await _renderComponent (options))
  }

  throw `[renderComponent] Unsupported render target '${options.renderTarget}'`
}

/**
 * Renders component(s) using the format specified by `options.renderTarget` 
 * (default is `RENDER_TARGET.SVG`). Requires at least one of 
 * `options.components`, `options.component`, or `options.game` to be defined.
 * @returns a blob url or array of blob urls of the rendered component(s).
 */
export async function renderComponents(options) {
  options = { ...DEFAULT_RENDER_OPTIONS, ...options }

  if(!options.components && !options.component && !options.game)
    throw `[renderComponents] At least one of 'options.components', 'options.component' or 'options.game' must be defined!`

  options.components = options.components || [ options.component ] || store.getters.findAllPrintableGameComponents(game)

  switch(options.renderTarget) {
    case RENDER_TARGET.SVG: return                      await _renderComponents(options)
    case RENDER_TARGET.JPG: return await _svgToRaster  (await _renderComponents(options))
    case RENDER_TARGET.PNG: return await _svgToRaster  (await _renderComponents(options))
    case RENDER_TARGET.PDF: return await _svgToDocument(await _renderComponents(options))
  }

  throw `[renderComponents] Unsupported render target '${options.renderTarget}'`
}

/**
 * Renders game using the format specified by `options.renderTarget` (default 
 * is `RENDER_TARGET.SVG`). Requires `options.game` to be defined.
 * @returns a blob url or array of blob urls of the rendered game.
 */
export async function renderGame(options) {
  options = { ...DEFAULT_RENDER_OPTIONS, ...options }

  if(!options.game) throw `[renderGame] 'options.game' must be defined!`

  switch(options.renderTarget) {
    case RENDER_TARGET.SVG: return                      await _renderGame(options)
    case RENDER_TARGET.JPG: return await _svgToRaster  (await _renderGame(options))
    case RENDER_TARGET.PNG: return await _svgToRaster  (await _renderGame(options))
    case RENDER_TARGET.PDF: return await _svgToDocument(await _renderGame(options))
  }

  throw `[renderGame] Unsupported render target '${options.renderTarget}'`
}


async function _renderItem (options) {

}

async function _renderItems(options) {

}

async function _renderComponent (options) {

}

async function _renderComponents(options) {

}

async function _renderGame(options) {

}



async function _svgToCanvas(url, options) {
  if(Array.isArray(url))
    return await Promise.all(map(url, svg => _svgToCanvas(svg, options)))

  options = { ...DEFAULT_RASTER_OPTIONS, ...options }

  // load url as image
  const image = await new Promise((resolve, reject) => {
    const image = new Image()
    image.onload  = () => resolve(image)
    image.onerror = () => reject (     )
    image.src = url
  })

  // draw image on canvas
  const context = document.createElement('canvas').getContext('2d', {
    antialias: options.rasterAA
  })
  context.canvas.width  = options.rasterW || image.width
  context.canvas.height = options.rasterH || image.height
  context.drawImage(image,
    0, 0,          image.width,          image.height,
    0, 0, context.canvas.width, context.canvas.height
  )

  return context.canvas
}

async function _svgToRaster(url, options) {
  if(Array.isArray(url))
    return await Promise.all(map(url, svg => _svgToRaster(svg, options)))

  options = { ...DEFAULT_RASTER_OPTIONS, ...options }

  // load url as image
  const image = await new Promise((resolve, reject) => {
    const image = new Image()
    image.onload  = () => resolve(image)
    image.onerror = () => reject (     )
    image.src = url
  })

  // draw image on canvas
  const context = document.createElement('canvas').getContext('2d', {
    antialias: options.rasterAA
  })
  context.canvas.width  = options.rasterW || image.width
  context.canvas.height = options.rasterH || image.height
  context.drawImage(image,
    0, 0,          image.width,          image.height,
    0, 0, context.canvas.width, context.canvas.height
  )

  // export canvas as blob
  return await new Promise( resolve => {
    context.canvas.toBlob(
      () => resolve(blob),
      options.renderTarget ,
      options.rasterQuality
    )
  })
}

async function _svgToDocument(url) {
  const pdf = new jsPDF({unit: 'in'})
  pdf.deletePage(1)

  async function _append(pdf, url) {
    const canvas = await _svgToCanvas(url)
    const
      w   = convert(canvas.width , PIXELS, INCHES),
      h   = convert(canvas.height, PIXELS, INCHES),
      png = canvas.toDataURL(RASTER_TARGET_PNG)
  
    pdf.addPage (          [w, h])
    pdf.addImage(png, 0, 0, w, h )
  }

  if(Array.isArray(url))
    await Promise.all(map(url, async i => await _append(pdf, i  )))
  else
    await ((                                    _append(pdf, url)))

  return pdf.output('bloburl')
}

function _preparePage (game, component, template, items, options) {
  return _preparePages(game, component, template, items, options)[0]
}

function _preparePages(game, component, template, items, options) {
  options = { ...DEFAULT_UNIT_OPTIONS, ...DEFAULT_PAGE_OPTIONS, ...options }
  if(!template) template = store.getters.findComponentTemplate(component)
  if(!items   ) items    = store.getters.getComponentItems    (component)
  const
    itemW = convert(template.size.w, INCHES, PIXELS, options),
    itemH = convert(template.size.h, INCHES, PIXELS, options),
    minPageW = itemW + options.pageMarginL + options.pageMarginR + options.itemPaddingL + options.itemPaddingR,
    minPageH = itemH + options.pageMarginT + options.pageMarginB + options.itemPaddingT + options.itemPaddingB

  if( options.pageW && options.pageW < minPageW) options.pageW        = minPageW
  if( options.pageH && options.pageH < minPageH) options.pageH        = minPageH
  if(!options.itemsPerPage                     ) options.itemsPerPage = items.length

  // If pageW AND pageH are undefined, then use grid layout to determine page size
  if(!options.pageW && !options.pageH) {

    // If grid layout is undefined, then use square grid
    if(!options.itemsPerRow && !options.itemsPerCol) {
      const size = Math.ceil(Math.sqrt(options.itemsPerPage))
      options.itemsPerRow = size
      options.itemsPerCol = size

    // If only itemsPerCol are undefined, then derive itemsPerCol
    } else if( options.itemsPerRow && !options.itemsPerCol) {
      options.itemsPerCol = Math.floor(options.itemsPerPage / options.itemsPerRow)

    // If only itemsPerRow are undefined, then derive itemsPerRow
    } else if(!options.itemsPerRow &&  options.itemsPerCol) {
      options.itemsPerRow = Math.floor(options.itemsPerPage / options.itemsPerCol)

    // If grid layout is defined, then clamp itemsPerPage
    } else {
      const maxItemsPerPage = options.itemsPerRow    *    options.itemsPerCol
      options.itemsPerPage  = Math.min(maxItemsPerPage, options.itemsPerPage)
    }

    // determine page size using grid layout
    options.pageW = options.pageMarginL + options.pageMarginR + (options.itemPaddingL + options.itemPaddingR + itemW) * options.itemsPerRow
    options.pageH = options.pageMarginT + options.pageMarginB + (options.itemPaddingT + options.itemPaddingB + itemH) * options.itemsPerCol

  // If only pageW is defined
  } else if( options.pageW && !options.pageH) {
    const maxItemsPerRow = Math.floor((options.pageW - options.pageMarginL - options.pageMarginR) / (itemW + options.itemPaddingL + options.itemPaddingR))
    options.itemsPerRow = Math.min(maxItemsPerRow, options.itemsPerRow) || maxItemsPerRow
    options.itemsPerCol = Math.floor(options.itemsPerPage / options.itemsPerRow)
    options.pageH = options.pageMarginT + options.pageMarginB + (itemH + options.itemPaddingT + options.itemPaddingB) * options.itemsPerCol

  // If only pageH is defined
  } else if(!options.pageW &&  options.pageH) {
    const maxItemsPerCol = Math.floor((options.pageH - options.pageMarginT - options.pageMarginB) / (itemH + options.itemPaddingT + options.itemPaddingB))
    options.itemsPerCol = Math.min(maxItemsPerCol, options.itemsPerCol) || maxItemsPerCol
    options.itemsPerRow = Math.floor(options.itemsPerPage / options.itemsPerCol)
    options.pageW = options.pageMarginL + options.pageMarginR + (itemW + options.itemPaddingL + options.itemPaddingR) * options.itemsPerRow
  
    // If pageW AND pageH are defined
  } else {
    const 
      maxItemsPerRow = Math.floor((options.pageW - options.pageMarginL - options.pageMarginR) / (itemW + options.itemPaddingL + options.itemPaddingR)),
      maxItemsPerCol = Math.floor((options.pageH - options.pageMarginT - options.pageMarginB) / (itemH + options.itemPaddingT + options.itemPaddingB))
    options.itemsPerRow   = Math.min(maxItemsPerRow , options.itemsPerRow ) || maxItemsPerRow
    options.itemsPerCol   = Math.min(maxItemsPerCol , options.itemsPerCol ) || maxItemsPerCol
    const maxItemsPerPage = options.itemsPerRow * options.itemsPerCol
    options.itemsPerPage  = Math.min(maxItemsPerPage, options.itemsPerPage) || maxItemsPerPage

  }

  const numberOfPages = Math.ceil(items.length / options.itemsPerPage)
}

function _svgjsObjectToBlobURL(obj) {
  if(Array.isArray(obj)) 
    return map(obj, i => _svgjsObjectToBlobURL(i))
  return _svgjsStringToBlobURL(obj.svg())
}

function _svgjsObjectToDataURL(obj) {
  if(Array.isArray(obj))
    return map(obj, i => _svgjsObjectToDataURL(i))
  return _svgjsStringToDataURL(obj.svg())
}

function _svgjsStringToBlobURL(str) {
  if(Array.isArray(str)) 
    return map(str, i => _svgjsStringToBlobURL(i))
  return URL.createObjectURL(new Blob([str], {type: 'image/svg+xml'}))
}

function _svgjsStringToDataURL(svg) {
  if(Array.isArray(svg))
    return map(svg, i => _svgjsStringToDataURL(i))
  // properly encode svg string using utf-16 to support double wide characters
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`
}






