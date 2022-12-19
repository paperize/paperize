/**********/
/* IMPORT */
/**********/

// core
import { SVG } from '@svgdotjs/svg.js'

// utility
import Bluebird from 'bluebird'
import Mustache from '../../services/tiny-mustache'
import { map, find, reduce, size } from 'lodash'
import { convert, INCHES, PIXELS, PERCENT_PARENT, DEFAULT_UNIT_OPTIONS, WH_MODE, POINTS } from '../../util/units'

// paperize
import store from '../../store'
import { TEXT_TYPE }  from '../../models/text_layer'
import { IMAGE_TYPE } from '../../models/image_layer'
import { SHAPE_TYPE } from '../../models/shape_layer'
import { getImageById, getImageByName } from '../image_provider'
// borrowed from pdf renderer
import { projectItem  } from '../pdf_renderer/item_projector'
import { findProperty } from '../pdf_renderer/helpers'

//jsPDF
import jsPDF from '../../jspdf'
import { text } from 'promisify-file-reader'

/******************/
/* RENDER OPTIONS */
/******************/

// used to specify the output of functions like renderGame(game, options)
export const RENDER_TARGET_SVG = 'render-target-svg'
export const RENDER_TARGET_PNG = 'render-target-png'
export const RENDER_TARGET_JPG = 'render-target-jpg'
export const RENDER_TARGET_PDF = 'render-target-pdf'
export const DEFAULT_RENDER_TARGET = RENDER_TARGET_SVG

// used to populate defaults of functions like renderGame(game, options)
export const DEFAULT_RENDER_OPTIONS = {
  renderTarget: RENDER_TARGET_SVG
}

/****************/
/* PAGE OPTIONS */
/****************/

// used to define component layout - any/all of these values may be set to zero
// and the renderer will attempt to intelligently arrange components by making
// reasonable substitutions *see _preparePages()
export const DEFAULT_ITEMS_PER_PAGE = 0
export const DEFAULT_ITEMS_PER_ROW  = 0
export const DEFAULT_ITEMS_PER_COL  = 0
export const DEFAULT_PAGE_W         = 0 // pixels
export const DEFAULT_PAGE_H         = 0 // pixels

// used to define component spacing from edge of page
export const DEFAULT_PAGE_MARGIN_T  = 0 // pixels
export const DEFAULT_PAGE_MARGIN_R  = 0 // pixels
export const DEFAULT_PAGE_MARGIN_B  = 0 // pixels
export const DEFAULT_PAGE_MARGIN_L  = 0 // pixels

// used to define spacing between components
export const DEFAULT_ITEM_PADDING_X = 0 // pixels
export const DEFAULT_ITEM_PADDING_Y = 0 // pixels

// used to populate defaults of functions like renderGameToSVG(game, options)
export const DEFAULT_PAGE_OPTIONS = {
  itemsPerPage : DEFAULT_ITEMS_PER_PAGE,
  itemsPerRow  : DEFAULT_ITEMS_PER_ROW ,
  itemsPerCol  : DEFAULT_ITEMS_PER_COL ,
  pageW        : DEFAULT_PAGE_W,
  pageH        : DEFAULT_PAGE_H,
  pageMarginT  : DEFAULT_PAGE_MARGIN_T,
  pageMarginR  : DEFAULT_PAGE_MARGIN_R,
  pageMarginB  : DEFAULT_PAGE_MARGIN_B,
  pageMarginL  : DEFAULT_PAGE_MARGIN_L,
  itemPaddingX : DEFAULT_ITEM_PADDING_X,
  itemPaddingY : DEFAULT_ITEM_PADDING_Y
}

/******************/
/* RASTER OPTIONS */
/******************/

// used to specify the output of functions like _svgToRasterImage()
// *see svgToPNG()
// *see svgToJPG()
export const RASTER_TARGET_PNG = 'image/png'
export const RASTER_TARGET_JPG = 'image/jpeg'
export const DEFAULT_RASTER_TARGET   = RASTER_TARGET_PNG

// used to specify whether or not canvas should use antialiasing
export const DEFAULT_RASTER_AA       = false
// used to define canvas size - any/all of these values may be set to zero and
// the renderer will attempt to intelligently size the canvas
// *see _svgToRasterImage()
export const DEFAULT_RASTER_W        = 0 // pixels
export const DEFAULT_RASTER_H        = 0 // pixels
// used to specify raster quality for compressed formats (jpeg) [0 - 1]
// *see canvas.toDataURL(type, encoderOptions)
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
export const DEFAULT_RASTER_QUALITY  = 1
// used to populate defaults of functions like _svgToRasterImage()
export const DEFAULT_RASTER_OPTIONS = {
  rasterTarget  : DEFAULT_RASTER_TARGET,
  rasterAA      : DEFAULT_RASTER_AA    ,
  rasterW       : DEFAULT_RASTER_W     ,
  rasterH       : DEFAULT_RASTER_H     ,
  rasterQuality : DEFAULT_RASTER_QUALITY
}

export const DEFAULT_OPTIONS = {
  ...DEFAULT_RENDER_OPTIONS,
  ...DEFAULT_PAGE_OPTIONS  ,
  ...DEFAULT_UNIT_OPTIONS  ,
  ...DEFAULT_RASTER_OPTIONS
}

/**************/
/* PUBLIC API */
/**************/

export async function renderGame(game, options) {
  options = { ...DEFAULT_RENDER_OPTIONS, ...options }
  switch(options.renderTarget) {
  case RENDER_TARGET_SVG : return await renderGameToSVG(game, options)
  case RENDER_TARGET_PNG : return await renderGameToPNG(game, options)
  case RENDER_TARGET_JPG : return await renderGameToJPG(game, options)
  case RENDER_TARGET_PDF : return await renderGameToPDF(game, options)
  }
}

export async function renderGameToSVG(game, options) {
  options = { ...DEFAULT_PAGE_OPTIONS, ...DEFAULT_UNIT_OPTIONS, ...options }
  // TODO

  const components = store.getters.findAllPrintableGameComponents(game)
  return renderComponentsToSVG(game, components, options)
}

export async function renderGameToPNG(game, options) {
  options = { ...DEFAULT_RASTER_OPTIONS, ...options }
  return await _svgToPNG(await renderGameToSVG(game, options), options)
}

export async function renderGameToJPG(game, options) {
  options = { ...DEFAULT_RASTER_OPTIONS, ...options }
  return await _svgToJPG(await renderGameToSVG(game, options), options)
}

export async function renderGameToPDF(game, options) {
  return await _svgToPDF(await renderGameToSVG(game, options), options)
}

export async function renderComponents(game, components, options) {
  options = { ...DEFAULT_RENDER_OPTIONS, ...options }
  switch(options.renderTarget) {
  case RENDER_TARGET_SVG : return await renderComponentsToSVG(game, components, options)
  case RENDER_TARGET_PNG : return await renderComponentsToPNG(game, components, options)
  case RENDER_TARGET_JPG : return await renderComponentsToJPG(game, components, options)
  case RENDER_TARGET_PDF : return await renderComponentsToPDF(game, components, options)
  }
}

export async function renderComponentsToSVG(game, components, options) {
  options = { ...DEFAULT_RASTER_OPTIONS, ...options }

  return reduce(components, (pages, component) => {
    return [...pages, ...renderComponentToSVG(game, component, options)]
  }, [ ])
}

export async function renderComponentsToPNG(game, components, options) {
  options = { ...DEFAULT_RASTER_OPTIONS, ...options }
  return await _svgToPNG(await renderComponentsToSVG(game, components, options), options)
}

export async function renderComponentsToJPG(game, components, options) {
  options = { ...DEFAULT_RASTER_OPTIONS, ...options }
  return await _svgToJPG(await renderComponentsToSVG(game, components, options), options)
}

export async function renderComponentsToPDF(game, components, options) {
  options = { ...DEFAULT_RASTER_OPTIONS, ...options }
  return await _svgToPDF(await renderComponentsToSVG(game, components, options), options)
}

export async function renderComponent(game, component, options) {
  options = { ...DEFAULT_RENDER_OPTIONS, ...options }
  switch(options.renderTarget) {
  case RENDER_TARGET_SVG : return await renderComponentToSVG(game, component, options)
  case RENDER_TARGET_PNG : return await renderComponentToPNG(game, component, options)
  case RENDER_TARGET_JPG : return await renderComponentToJPG(game, component, options)
  case RENDER_TARGET_PDF : return await renderComponentToPDF(game, component, options)
  }
}

export async function renderComponentToSVG(game, component, options) {
  options = { ...DEFAULT_PAGE_OPTIONS, ...DEFAULT_UNIT_OPTIONS, ...options }

  const template = store.getters.findComponentTemplate(component)
  const items    = store.getters. getComponentItems   (component)
  const pages    = _preparePages(game, component, template, items, options)

  await _renderItems(game, component, template, items, pages, options)

  return _svgjsObjectToDataURL(pages)
}

export async function renderComponentToPNG(game, component, template, options) {
  options = { ...DEFAULT_RASTER_OPTIONS, ...options }
  return await _svgToPNG(await renderComponentToSVG(game, component, template, options), options)
}

export async function renderComponentToJPG(game, component, template, options) {
  options = { ...DEFAULT_RASTER_OPTIONS, ...options }
  return await _svgToJPG(await renderComponentToSVG(game, component, template, options), options)
}

export async function renderComponentToPDF(game, component, template, options) {
  return await _svgToPDF(await renderComponentToSVG(game, component, template, options), options)
}

export async function renderItems(game, component, template, items, options) {
  options = {... DEFAULT_RENDER_OPTIONS, ... options}
  switch(options.renderTarget) {
  case RENDER_TARGET_SVG : return await renderItemsToSVG(game, component, template, items, options)
  case RENDER_TARGET_PNG : return await renderItemsToPNG(game, component, template, items, options)
  case RENDER_TARGET_JPG : return await renderItemsToJPG(game, component, template, items, options)
  case RENDER_TARGET_PDF : return await renderItemsToPDF(game, component, template, items, options)
  }
}

export async function renderItemsToSVG(game, component, template, items, options) {
  options = { ...DEFAULT_PAGE_OPTIONS, ...DEFAULT_UNIT_OPTIONS, ...options }
  const pages = _preparePages(game, component, template, items, options)
  await _renderItems(game, component, template, items, pages, options)
  return _svgjsObjectToDataURL(pages)
}

export async function renderItemsToPNG(game, component, template, items, options) {
  options = { ...DEFAULT_RASTER_OPTIONS, ...options }
  return await _svgToPNG(await renderItemsToSVG(game, component, template, items, options), options)
}

export async function renderItemsToJPG(game, component, template, items, options) {
  options = { ...DEFAULT_RASTER_OPTIONS, ...options }
  return await _svgToJPG(await renderItemsToSVG(game, component, template, items, options), options)
}

export async function renderItemsToPDF(game, component, template, items, options) {
  return await _svgToPDF(await renderItemsToSVG(game, component, template, items, options), options)
}

export async function renderItem(game, component, template, item, options) {
  options = { ...DEFAULT_RENDER_OPTIONS, ...options }
  switch(options.renderTarget) {
  case RENDER_TARGET_SVG : return await renderItemToSVG(game, component, template, item, options)
  case RENDER_TARGET_PNG : return await renderItemToPNG(game, component, template, item, options)
  case RENDER_TARGET_JPG : return await renderItemToJPG(game, component, template, item, options)
  case RENDER_TARGET_PDF : return await renderItemToPDF(game, component, template, item, options)
  }
}

export async function renderItemToSVG(game, component, template, item, options) {
  options = { ...DEFAULT_PAGE_OPTIONS, ...DEFAULT_UNIT_OPTIONS, ...options }
  const page = _preparePages(game, component, template, [item], options)[0]
  await _renderItem(game, component, template, item, page, options)
  return _svgjsObjectToDataURL(page)
}

export async function renderItemToPNG(game, component, template, item, options) {
  options = { ...DEFAULT_RASTER_OPTIONS, ...options }
  return await _svgToPNG(await renderItemToSVG(game, component, template, item, options), options)
}

export async function renderItemToJPG(game, component, template, item, options) {
  options = { ...DEFAULT_RASTER_OPTIONS, ...options }
  return await _svgToJPG(await renderItemToSVG(game, component, template, item, options), options)
}

export async function renderItemToPDF(game, component, template, item, options) {
  return await _svgToPDF(await renderItemToSVG(game, component, template, item, options), options)
}

/***************/
/* PRIVATE API */
/***************/

// ! private functions have been denoted with an underscore prefix !


// This is a beast of a function, I have done my best to anglicize the logic
// throughout; however, I will also give a brief overview of what this function
// does and how it behaves.

// _preparePages is used to parse options and automatically perform
// substitutions before initializing svgjs. All page options are expected to be
// zero or a positive integer. This function will throw an error when the
// effective page size (in any dimension) is less than the minimum required size
// to render an item.

// When performing substitutions:

// If pageW or pageH are zero they will be substitued with the maximum allowable
// size as determined by itemsPerRow, itemsPerCol, and itemsPerPage

// If itemsPerRow or itemsPerCol are zero or exceed the maximum allowable
// number of items along a dimension they will be substituted with the
// maximum allowable number of items along that dimension

// If itemsPerPage is zero or greater than the maximum allowable number of
// items per page as determined by itemsPerRow and itemsPerCol then it will be
// substituted with the maximum allowable number of items per page

function _preparePages(game, component, template, items, options) {
  // compute component size in pixels
  options['itemW'] = convert(template.size.w, INCHES, PIXELS, options)
  options['itemH'] = convert(template.size.h, INCHES, PIXELS, options)

  // compute effective page size (only query after checking if pageW or pageH is defined!)
  const effectivePageW = options.pageW - options.pageMarginL - options.pageMarginR
  const effectivePageH = options.pageH - options.pageMarginT - options.pageMarginB

  if(
    (options.pageW && effectivePageW < options.itemW) ||
    (options.pageH && effectivePageH < options.itemH)
  )
    throw `Effective page size is too small for component!`

  // if itemsPerPage is not defined
  if(!options.itemsPerPage)
    options.itemsPerPage = items.length
  // if page size is undefined
  if(!options.pageW && !options.pageH) {
    // if grid layout is undefined
    if(!options.itemsPerRow && !options.itemsPerCol) {
      // then compute 'square' grid layout
      options.itemsPerRow = Math.ceil(Math.sqrt(options.itemsPerPage))
      options.itemsPerCol = Math.ceil(Math.sqrt(options.itemsPerPage))
    // if grid layout is partially undefined where only itemsPerRow is defined
    } else if( options.itemsPerRow && !options.itemsPerCol) {
      // then derive itemsPerCol using itemsPerPage and itemsPerRow
      options.itemsPerCol = Math.floor(options.itemsPerPage / options.itemsPerRow)
    // if grid layout is partially undefined where only itemsPerCol is defined
    } else if(!options.itemsPerRow &&  options.itemsPerCol) {
      // then derive itemsPerRow using itemsPerPage and itemsPerCol
      options.itemsPerRow = Math.floor(options.itemsPerPage / options.itemsPerCol)
    // if grid layout is well defined
    } else {
      // then compute maxItemsPerPage
      const maxItemsPerPage = options.itemsPerRow * options.itemsPerCol
      // enforce upper bound on itemsPerPage
      options.itemsPerPage = Math.min(options.itemsPerPage, maxItemsPerPage)
    }
    // compute page size using grid layout
    options.pageW = options.pageMarginL + options.pageMarginR - options.itemPaddingX + (options.itemW + options.itemPaddingX) * options.itemsPerRow
    options.pageH = options.pageMarginT + options.pageMarginB - options.itemPaddingY + (options.itemH + options.itemPaddingY) * options.itemsPerCol
  // if page size is partially undefined where only pageW is defined
  } else if( options.pageW && !options.pageH) {
    // then compute maxItemsPerRow
    const maxItemsPerRow = Math.floor((effectivePageW - options.itemPaddingX) / (options.itemW + options.itemPaddingX))
    // enforce upper bound on itemsPerRow
    options.itemsPerRow = Math.min(options.itemsPerRow, maxItemsPerRow) || maxItemsPerRow
    // derive itemsPerCol using itemsPerPage and itemsPerRow
    options.itemsPerCol = Math.floor(options.itemsPerPage / options.itemsPerRow)
    // compute pageH using grid layout
    options.pageH = options.pageMarginT + options.pageMarginB - options.itemPaddingY + (options.itemH + options.itemPaddingY) * options.itemsPerCol
  // if page size is partially undefined where only pageH is defined
  } else if(!options.pageW &&  options.pageH) {
    // then compute maxItemsPerCol
    const maxItemsPerCol = Math.floor((effectivePageH - options.itemPaddingY) / (options.itemH + options.itemPaddingY))
    // enforce upper bound on itemsPerCol
    options.itemsPerCol = Math.min(options.itemsPerCol, maxItemsPerCol) || maxItemsPerCol
    // derive itemsPerRow using itemsPerPage and itemsPerCol
    options.itemsPerRow = Math.floor(options.itemsPerPage / options.itemsPerCol)
    // compute pageW using grid layout
    options.pageW = options.pageMarginL + options.pageMarginR - options.itemPaddingX + (options.itemW + options.itemPaddingX) * options.itemsPerRow
  // if page size is well defined
  } else {
    // then compute upper bounds for grid layout
    const maxItemsPerRow  = Math.floor((effectivePageW - options.itemPaddingX) / (options.itemW + options.itemPaddingX))
    const maxItemsPerCol  = Math.floor((effectivePageH - options.itemPaddingY) / (options.itemH + options.itemPaddingY))

    // enforce upper bounds for grid layout
    options.itemsPerRow  = Math.min(options.itemsPerRow , maxItemsPerRow ) || maxItemsPerRow
    options.itemsPerCol  = Math.min(options.itemsPerCol , maxItemsPerCol ) || maxItemsPerCol

    // compute maxItemsPerPage
    const maxItemsPerPage = options.itemsPerRow * options.itemsPerCol
    // enforce upper bound on maxItemsPerPage
    options.itemsPerPage = Math.min(options.itemsPerPage, maxItemsPerPage)
  }

  const numberOfPages = Math.ceil(items.length / options.itemsPerPage)

  return map(new Array(numberOfPages), () => {
    return SVG().size(
      options.pageW,
      options.pageH
    )
  })
}



async function _renderComponents(game, components, options) {

}

async function _renderComponent(game, component, options) {
  
}

async function _renderItems(game, component, template, items, pages, options) {
  // iterate over items using index to derive page, row, and col
  for(let item = 0; item < items.length; item ++) {
    const page = Math.floor( item / options.itemsPerPage )
    const row  = Math.floor((item - options.itemsPerPage * page) / options.itemsPerRow      )
    const col  =            (item - options.itemsPerPage * page) - options.itemsPerRow * row

    // compute item position on page and hand off via options
    options['itemOffsetX'] = options.pageMarginL + (options.itemW + options.itemPaddingX) * col
    options['itemOffsetY'] = options.pageMarginT + (options.itemH + options.itemPaddingY) * row
    await _renderItem(game, component, template, items[item], pages[page], options)
  }
}

async function _renderItem (game, component, template, item , page , options) {
  const layers = store.getters.findAllTemplateLayers(template)
  options['itemOffsetX'] = options.itemOffsetX || 0
  options['itemOffsetY'] = options.itemOffsetY || 0
  // initialize item specific sub-image
  page = page.nested().size(
    options.itemW,
    options.itemH
  ).move(
    options.itemOffsetX,
    options.itemOffsetY
  )

  await Bluebird.each(layers, async (layer) => {
    await _renderLayer(game, component, template, item, page, layer, options)
  })
}

async function _renderLayer(game, component, template, item, page, layer, options) {
  // borrow item projection from pdf_renderer
  if(!(layer = projectItem(layer, item)).visible) return
  switch(layer.type) {
  case TEXT_TYPE : return await _renderTextLayer (game, component, template, item, page, layer, options)
  case IMAGE_TYPE: return await _renderImageLayer(game, component, template, item, page, layer, options)
  case SHAPE_TYPE: return await _renderShapeLayer(game, component, template, item, page, layer, options)
  }
}

// TODO:
// text alignment
// text wrapping
// shrink to fit
// font caching (maybe write a font_provider? similar to the image_provider?)
// font deduplication
// inline elements
async function _renderTextLayer (game, component, template, item, page, layer, options) {
  // COPY - ish from pdf_renderer
  const
    textContentTemplateVars = reduce(item, (i, kv) => {
      i[kv.key] = kv.value
      return i
    }, { }),

    defaultTextContentTemplate = textContentTemplateVars[layer.name],

    textContentTemplate =
            layer .textContentTemplate ||
            defaultTextContentTemplate,

    projectedText = textContentTemplate ? Mustache(
      textContentTemplate    ,
      textContentTemplateVars
    ) : ""
    // END COPY

  const elements = _parseInlineElements(projectedText)

  await _embedInlineFonts(game, component, template, item, page, layer, elements, options)
  // _embedInlineIcons(game, component, template, item, page, layer, elements, options)
  _layoutInlineElements(game, component, template, item, page, layer, elements, options)
  _renderInlineElements(game, component, template, item, page, layer, elements, options)
}

// inline element types
const 
  _INLINE_BREAK = 'inline-break',
  _INLINE_SPACE = 'inline-space',
  _INLINE_TEXT  = 'inline-text' ,
  _INLINE_ICON  = 'inline-icon' ;

const _InlineBreakElement = {
  type: _INLINE_BREAK
}

const _InlineSpaceElement = {
  type: _INLINE_SPACE,
  // layout
  x: 0, y: 0,
  w: 0, h: 0,
  lineHeight : 0,
  lineAscent : 0,
  lineDescent: 0,
  // element-specific property
  ws: 0
}

const _InlineTextElement = {
  type: _INLINE_TEXT,
  // layout
  x: 0, y: 0,
  w: 0, h: 0,
  lineHeight : 0,
  lineAscent : 0,
  lineDescent: 0,
  // element-specific property
  text: ''
}

const _InlineIconElement = {
  type: _INLINE_ICON
}

function _parseInlineElements(projectedText) {
  let
    elements = [ ],
    element,
    context;

  function _stackPush() {
    if(element && context) {
      elements.push(element)
      element = undefined
      context = undefined
    }
  }

  [...projectedText].forEach( c => {
    switch(c) {

    default: // default is text for now but more to come
      if(context != _INLINE_TEXT) {
        _stackPush()
        element = {..._InlineTextElement}
        context =     _INLINE_TEXT
      }
      element.text += c; break;

    case '\n':
      if(context != _INLINE_BREAK) {
        _stackPush()
        element = {..._InlineBreakElement}
        context =     _INLINE_BREAK
      } 
      _stackPush(); break;

    case '\r':
      if(context != _INLINE_BREAK) {
        _stackPush()
        element = {..._InlineBreakElement}
        context =     _INLINE_BREAK
      } break;

    case '\t':
      if(context != _INLINE_SPACE) {
        _stackPush()
        element = {..._InlineSpaceElement}
        context =     _INLINE_SPACE
      }
   // ignore tab width for now
   // element.ws += 4
      element.ws += 1; break;

    case  ' ':
      if(context != _INLINE_SPACE) {
        _stackPush()
        element = {..._InlineSpaceElement}
        context =     _INLINE_SPACE
      }
      element.ws += 1; break;
    }
  })
  _stackPush()

  return elements;
}

const _SYSTEM_FONT = 'system-font'
const _GOOGLE_FONT = 'google-font'

const _SystemFont = {
  type: _SYSTEM_FONT,

  family : undefined,
  style  : 'normal',
  weight : 'normal',
  variant: 'normal'
}

const _GoogleFont = {
  type: _GOOGLE_FONT,

  family : undefined,
  style  : 'normal',
  weight : 'normal',
  variant: 'normal',

  location: undefined
}

function _deriveFont(fontFamily, fontStyle) {
  const
    googleFont         = find(store.getters.googleFontsRaw, { family: fontFamily }),
    googleFontLocation = googleFont !== undefined && googleFont.variants[fontStyle];

  if(googleFont && googleFontLocation)
    return {..._GoogleFont,
      family  : `${fontFamily} ${fontStyle}`,
      location: googleFontLocation
    }
  else switch(fontStyle) {
    default:
    case     'normal': return {..._SystemFont, family: fontFamily}
    case       'bold': return {..._SystemFont, family: fontFamily, weight: 'bold'                 }
    case     'italic': return {..._SystemFont, family: fontFamily,                 style: 'italic'}
    case 'bolditalic': return {..._SystemFont, family: fontFamily, weight: 'bold', style: 'italic'}
  }
}

async function _embedInlineFont (page, font) {
  // check for font in page
  if( find(page.defs().children(), child => {
    return child.type === 'style' && child.node.innerHTML.startsWith(`@font-face{font-family:${font.family}`)
  }) !== undefined) return
  
  // load font as base64 string
  const fontBase64 = await new Promise( async (res, rej) => {
    const reader = new FileReader()
    reader.onload  = () => res(reader.result)
    reader.onerror = () => rej(             )
    reader.readAsDataURL(await(await fetch(font.location)).blob())
  })

  page.defs().fontface(font.family, `url(${fontBase64})`)

  const fontface = new FontFace(font.family, `url(${fontBase64})`)
  await fontface.load()

  document.fonts.add(fontface)
  await new Promise(resolve => {
    document.fonts.ready.then(() => {
      resolve()
    })
  })
}

async function _embedInlineFonts(game, component, template, item, page, layer, elements,  options) {
  options['defaultFont'] = _deriveFont(
    layer.textFontName ,
    layer.textFontStyle
  )
  
  if(options.defaultFont.type === _GOOGLE_FONT)
    await _embedInlineFont(page, options.defaultFont)
  
  // await Promise.all(map(elements, async element => {
  //   if( // guard clause
  //     element.type !== _INLINE_TEXT &&
  //     element.type !== _INLINE_SPACE
  //   ) return

  //   const font = element.style.font || options.defaultFont
  //   if(font.type === _GOOGLE_FONT)
  //     await _embedInlineFont(page, font)
  // }))
}

const _Line = {
  elements: undefined,

  lineHeight : 0,
  lineAscent : 0,
  lineDescent: 0,

  textWidth: 0,
  spaceWidth: 0,
  totalWidth: 0
}

function _layoutInlineElements(game, component, template, item, page, layer, elements, options) {
  const d = store.getters.getLayerDimensions(layer)
  const layerW = convert(d.w, PERCENT_PARENT, PIXELS, {...options,
    parentW: options.itemW,
    parentH: options.itemH,
    whMode: WH_MODE.W
  })
  const layerH = convert(d.h, PERCENT_PARENT, PIXELS, {...options,
    parentW: options.itemW,
    parentH: options.itemH,
    whMode: WH_MODE.H
  })
  const layerX = convert(d.x, PERCENT_PARENT, PIXELS, {...options,
    parentW: options.itemW, 
    parentH: options.itemH,
    w: layerW, h: layerH, whMode: WH_MODE.W
  })
  const layerY = convert(d.y, PERCENT_PARENT, PIXELS, {...options,
    parentW: options.itemW,
    parentH: options.itemH,
    w: layerW, h: layerH, whMode: WH_MODE.H
  })

  // for parity ignore inline styles, use defaultFont, defaultSize, and defaultColor
  const 
    defaultFont = options.defaultFont || _deriveFont(
      layer.textFontName ,
      layer.textFontStyle
    ),
    defaultSize  = layer.textSize ,
    defaultColor = layer.textColor; 

  const 
    g = page.group(),
    t   =   g.text();
  // disable build mode for computing text metrics
  t.build(false)
 
  let 
    lines,
    linesHeight,
    preferredSize = defaultSize
  // shrink-to-fit pass
  shrinkToFit:
  for(; preferredSize >= 4; preferredSize --) {
    const pixelsSize = convert(preferredSize, POINTS, PIXELS)
    t.font({
      family : defaultFont.family,
      style  : defaultFont.style , 
      weight : defaultFont.weight,
      variant: defaultFont.variant,
      size: pixelsSize
    })

    // compute text metrics for current size
    let bbox
    t.tspan("* *")
    const w0 = (bbox = t.bbox()).w
    t.tspan( "*" )
    const w1 = (bbox = t.bbox()).w

    const 
      widthOfSpace = w0 - w1 - w1,
      lineHeight   =          bbox.h, // distance from cursor.y to the next line
      lineAscent   =      0 - bbox.y, // distance from cursor.y to the baseline
      lineDescent  = bbox.y + bbox.h; // distance from the baseline to the next line

    lines = [ ]
    linesHeight  =  0
    let line = {..._Line,
      lineHeight,
      lineAscent,
      lineDescent,
      elements: [ ]
    }
    
    for(const element of elements) {
      switch(element.type) {
      case _INLINE_BREAK: {
        // new line
        linesHeight += lineHeight
        if(linesHeight + lineHeight > layerH)
          continue shrinkToFit

        lines.push( line )
        line  = {..._Line,
          lineHeight,
          lineAscent,
          lineDescent,
          elements: [ ]
        }
      } break
      case _INLINE_SPACE: {
        // if whitespace is at beginning of line ignore it
        if(line.totalWidth === 0) break

        // compute width of whitespace (if horizontal alignment is justify default to 1 width)
        const elementWidth = (layer.horizontalAlignment === 'justify' ? 1 : element.ws) * widthOfSpace

        // if whitespace is at the end of a line ignore it and move to next line
        if(line.totalWidth + elementWidth >= layerW) {
          // new line
          linesHeight += lineHeight
          if(linesHeight + lineHeight > layerH)
            continue shrinkToFit

          lines.push( line )
          line  = {..._Line,
            lineHeight,
            lineAscent,
            lineDescent,
            elements: [ ]
          }
        } else {
          element.x = line.totalWidth
          element.y = linesHeight
          element.w = elementWidth
          element.h = lineHeight

          element.lineHeight  = lineHeight
          element.lineAscent  = lineAscent
          element.lineDescent = lineDescent

          line.totalWidth += elementWidth
          line.spaceWidth += elementWidth
          line.elements.push ( element )
        }
      } break
      case _INLINE_TEXT : {
        t.tspan(element.text)

        const elementWidth = t.bbox().w

        // if element exceeds horizontal bounds, move to next size
        if(elementWidth > layerW)
          continue shrinkToFit

        // if element exceeds horizontal bounds, move to next line
        if(line.totalWidth + elementWidth > layerW) {
          // if previous element was a space, remove it
          const previous = line.elements.pop()
          if(previous && previous.type !== _INLINE_SPACE)
            line.elements.push(previous)
          else {
            line.totalWidth -= previous.w
            line.spaceWidth -= previous.w
          }
          
          // new line
          linesHeight += lineHeight
          if(linesHeight + lineHeight > layerH)
            continue shrinkToFit

          lines.push( line )
          line  = {..._Line,
            lineHeight,
            lineAscent,
            lineDescent,
            elements: [ ]
          }
        }

        element.x = line.totalWidth
        element.y = linesHeight
        element.w = elementWidth
        element.h = lineHeight

        element.lineHeight  = lineHeight
        element.lineAscent  = lineAscent
        element.lineDescent = lineDescent

        line.totalWidth += elementWidth
        line.textWidth  += elementWidth
        line.elements.push ( element )
      }
      case _INLINE_ICON : /* do nothing */ break;
      }
    }

    linesHeight += lineHeight
    if(linesHeight + lineHeight > layerH)
      continue shrinkToFit

    lines.push( line )
    break  shrinkToFit
  }
  t.remove()
  // g.remove()

  // layer.horizontalAlignment = 'justify'
  
  for(const line of lines) {
    let 
      tx = layerX,
      ty = layerY,
      ws = (layerW - line.textWidth) / line.spaceWidth

    switch(layer.horizontalAlignment) {
      case   'left': /* do nothing */ break;
      case 'center': tx += (layerW - line.totalWidth) / 2; break;
      case  'right': tx += (layerW - line.totalWidth)    ; break;
      // special case handled later
      case 'justify': /* do nothing */ break;
    }

    switch(layer.verticalAlignment) {
      case    'top': /* do nothing */ break;
      case 'middle': ty += (layerH - linesHeight) / 2; break;
      case 'bottom': ty += (layerH - linesHeight)    ; break;
    }

    for(const element of line.elements) {
      element.x += tx
      element.y += ty

      if(layer.horizontalAlignment === 'justify' && element.type === _INLINE_SPACE) {
        const dx = element.w * (ws - 1)
        element.w *= ws
        tx += dx
      }

      // debug layout
      // if(element.type === _INLINE_TEXT)
      //   g.rect(element.w, element.h).move(element.x, element.y).fill('#0f0')
      // else
      //   g.rect(element.w, element.h).move(element.x, element.y).fill('#f00')
    }
  }

  options['preferredSize'] = preferredSize
}

function _renderInlineElements(game, component, template, item, page, layer, elements, options) {
  const g = page.group()

  const 
    defaultFont = options.defaultFont || _deriveFont(
      layer.textFontName ,
      layer.textFontStyle
    ),
    defaultSize  = convert(options.preferredSize || layer.textSize, POINTS, PIXELS) ,
    defaultColor = layer.textColor;

  const t = g.text().font({
    family : defaultFont.family,
    style  : defaultFont.style , 
    weight : defaultFont.weight,
    variant: defaultFont.variant,
    size: defaultSize
  }).fill({color: defaultColor})
  // enable text building
  t.build(true)
  
  for(const element of elements) {
    if(element.type === _INLINE_TEXT) {
      t.tspan(element.text).move(
        element.x                     ,
        element.y + element.lineAscent
      )
    }
  }
}


// TODO:
// image caching (I think this is already handled by the image_provider)
// image deduplication
async function _renderImageLayer(game, component, template, item, page, layer, options) {
  // COPY from the pdf renderer
  let imagePromise

  if(layer.imageNameStatic) {
    // imageNameStatic can be set without providing an imageId for some reason???
    if(!layer.imageId)
      return
    imagePromise = getImageById(layer.imageId)
  } else {
    const
      prefix = layer.imageNamePrefix,
      suffix = layer.imageNameSuffix,
      name   = findProperty(item, layer.imageNameProperty)
    imagePromise = getImageByName(`${prefix}${name}${suffix}`)
  }
  // END COPY

  const imagePath = (await imagePromise).src

  const d = store.getters.getLayerDimensions(layer)
  const w = convert(d.w, PERCENT_PARENT, PIXELS, {...options,
    parentW: options.itemW,
    parentH: options.itemH,
    whMode: WH_MODE.W
  })
  const h = convert(d.h, PERCENT_PARENT, PIXELS, {...options,
    parentW: options.itemW,
    parentH: options.itemH,
    whMode: WH_MODE.H
  })
  const x = convert(d.x, PERCENT_PARENT, PIXELS, {...options,
    parentW: options.itemW,
    parentH: options.itemH,
    w, h, whMode: WH_MODE.W
  })
  const y = convert(d.y, PERCENT_PARENT, PIXELS, {...options,
    parentW: options.itemW,
    parentH: options.itemH,
    w, h, whMode: WH_MODE.H
  })

  const g = page.group()

  // promisify svgjs image loading
  const image = await new Promise((resolve) => {
    const image = g.image(imagePath, () => {
      resolve(image)
    })
  })

  const clip = g.clip()
  clip.add(g.rect(w, h).move(x, y))
  g.clipWith(clip)

  let sx = w / image.width ()
  let sy = h / image.height()

  switch(layer.imageScaling) {
  case   'stretch' : /* do nothing */ break;
  case  'fitToBox' : sx = sy = Math.min(sx, sy); break;
  case 'fillToBox' : sx = sy = Math.max(sx, sy); break;
  }

  let tx = x
  let ty = y

  switch(layer.horizontalAlignment) {
  case   'left': /* do nothing */ break;
  case 'center': tx += (w - image.width() * sx) / 2; break;
  case  'right': tx += (w - image.width() * sx)    ; break;
  }

  switch(layer.verticalAlignment) {
  case    'top': /* do nothing */ break;
  case 'middle': ty += (h - image.height() * sy) / 2; break;
  case 'bottom': ty += (h - image.height() * sy)    ; break;
  }

  image.transform({origin: [0, 0], translate:[tx, ty], scale:[sx, sy]})
}

async function _renderShapeLayer(game, component, template, item, page, layer, options) {
  // convert strokeWidth from inches (jsPDF/Paperize default) to pixels
  layer.strokeWidth = convert(layer.strokeWidth, INCHES, PIXELS, options)

  const d = store.getters.getLayerDimensions(layer)
  const w = convert(d.w, PERCENT_PARENT, PIXELS, {...options,
    parentW: options.itemW,
    parentH: options.itemH,
    whMode: WH_MODE.W
  })
  const h = convert(d.h, PERCENT_PARENT, PIXELS, {...options,
    parentW: options.itemW,
    parentH: options.itemH,
    whMode: WH_MODE.H
  })
  const x = convert(d.x, PERCENT_PARENT, PIXELS, {...options,
    parentW: options.itemW,
    parentH: options.itemH,
    w, h, whMode: WH_MODE.W
  })
  const y = convert(d.y, PERCENT_PARENT, PIXELS, {...options,
    parentW: options.itemW,
    parentH: options.itemH,
    w, h, whMode: WH_MODE.H
  })

  const g = page.group()

  // convert roundedRect radius from inches (jsPDF/Paperize default) to pixels
  const R = convert(.1, INCHES, PIXELS, options)

  let shape
  // color does not support alpha channel, so opacity must be specified to enable a transparent fill
  switch(layer.shape) {
  case        "rectangle": shape = g.rect(w, h).move(x, y).fill({opacity: 0})          ; break;
  case "roundedRectangle": shape = g.rect(w, h).move(x, y).fill({opacity: 0}).radius(R); break;
  case "ellipse": shape = g.ellipse(w, h).move(x, y).fill({opacity: 0}); break;
  }

  if(layer.fillPresent  )
    shape.fill({
      color: layer.fillColor,
      opacity: 1
    })
  if(layer.strokePresent)
    shape.stroke({
      color: layer.strokeColor,
      width: layer.strokeWidth
    })

  g.add(shape)
}

/********************/
/* HELPER FUNCTIONS */
/********************/

// *see _svgToRasterImage()
async function _svgToPNG(url, options) {
  return await _svgToRasterImage(url, { ...options, rasterTarget: RASTER_TARGET_PNG})
}

// *see _svgToRasterImage()
async function _svgToJPG(url, options) {
  return await _svgToRasterImage(url, { ...options, rasterTarget: RASTER_TARGET_JPG})
}

async function _svgToPDF(url, options) {
  const pdf = new jsPDF({unit: 'px'})
  pdf.deletePage(1)

  if(Array.isArray(url)) {
    await Promise.all(
      map(url, i => _svgAppendToPDF(pdf, i, options))
    )
  } else {
      await _svgAppendToPDF(pdf, url, options)
  }

  return pdf.output('bloburl')
}

async function _svgAppendToPDF(pdf, url, options) {
  const canvas = await _svgToCanvas(url, {...options})
  const
    w   = canvas.width ,
    h   = canvas.height,
    png = canvas.toDataURL(RASTER_TARGET_PNG)

  pdf.addPage (          [w, h])
  pdf.addImage(png, 0, 0, w, h )
}

// expects svg dataurl or array of svg dataurls
// returns a dataurl or array of dataurls
function _svgToRasterImage(url, options) {
  return new Promise(async (resolve) => {
    if(Array.isArray(url)) {
      resolve(await Promise.all(
        map(url, i => _svgToRasterImage(i, options))
      ))
      return
    }

    const image = await _svgToImageElement(url, options)

    const context = document.createElement('canvas').getContext('2d', {
      antialias: options.rasterAA
    })
    context.canvas.width  = options.rasterW || image.width
    context.canvas.height = options.rasterH || image.height
    context.drawImage(image,
      0, 0,          image.width,          image.height,
      0, 0, context.canvas.width, context.canvas.height
    )

    return resolve(context.canvas.toDataURL(
      options.rasterTarget,
      options.rasterQuality
    ))
  })
}

// *see _svgToRasterImage
function _svgToCanvas(url, options) {
  return new Promise(async (resolve) => {
    if(Array.isArray(url)) {
      resolve(await Promise.all(
        map(url, i => _svgToCanvas(i, options))
      ))
      return
    }

    const image = await _svgToImageElement(url, options)

    const context = document.createElement('canvas').getContext('2d', {
      antialias: options.rasterAA
    })
    context.canvas.width  = options.rasterW || image.width
    context.canvas.height = options.rasterH || image.height
    context.drawImage(image,
      0, 0,          image.width,          image.height,
      0, 0, context.canvas.width, context.canvas.height
    )

    resolve(context.canvas)
  })
}

// expects svg dataurl or array of svg dataurls
// returns an SVGImageElement or an array of SVGImageElements
// required to render svg to canvas
function _svgToImageElement(url) {
  return new Promise(async (resolve) => {
    if(Array.isArray(url)) {
      resolve(await Promise.all(
        map(url, i => _svgToImageElement(i))
      ))
      return
    }

    const image = new Image()
    image.addEventListener(
      'load',
      () => resolve(image),
      { once: true }
    )
    image.src = url
  })
}

// expects svgjs instance or an array of svgjs instances
// returns a dataurl or an array of dataurls
function _svgjsObjectToDataURL(svg) {
  if(Array.isArray(svg))
    return map(svg, i => _svgjsObjectToDataURL(i))
  return _svgjsStringToDataURL(svg.svg())
}


// expects svgjs string or an array of svgjs strings
// returns a dataurl or an array of dataurls
function _svgjsStringToDataURL(svg) {
  if(Array.isArray(svg))
    return map(svg, i => _svgjsStringToDataURL(i))
    // properly encode svg string using utf-16 to support double wide characters
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`
  // return `data:image/svg+xml;base64,${btoa(svg)}`
}


// these functions are no longer necessary, but remain here in case they become
// useful later

// *see _svgjsObjectToDataURL
function _svgjsObjectToBlobURL(svg) {
  if(Array.isArray(svg))
    return map(svg, i => _svgjsObjectToBlobURL(i))
  return _svgjsStringToBlobURL(svg.svg())
}

// *see _svgjsStringToDataURL
function _svgjsStringToBlobURL(svg) {
  if(Array.isArray(svg))
    return map(svg, i => _svgjsStringToBlobURL(i))
  return URL.createObjectURL(new Blob([svg], {type: 'image/svg+xml'}))
}

// convert dataurl to bloburl
// https://stackoverflow.com/questions/12168909/blob-from-dataurl
function _dataToBlob(url) {
  const dataString = atob(url.split(',')[1])
  const mimeString =      url.split(',')[0].split(':')[1].split(';')[0]

  const ab = new ArrayBuffer(dataString.length)
  const ia = new Uint8Array(ab)

  for(let i = 0; i < dataString.length; i ++)
    ia[i] = dataString.charCodeAt(i)

  const blob = new Blob([ab], {type: mimeString})
  return URL.createObjectURL(blob)
}
