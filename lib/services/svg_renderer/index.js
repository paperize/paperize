import { convert, INCHES, PIXELS, DEFAULT_UNIT_OPTIONS } from '../../util/units'

import { map, range } from 'lodash'

import store from '../../store'

import { SVG, Color } from '@svgdotjs/svg.js'

import { TEXT_TYPE }  from '../../models/text_layer'
import { IMAGE_TYPE } from '../../models/image_layer'
import { SHAPE_TYPE } from '../../models/shape_layer'

// PAGE OPTIONS
export const DEFAULT_ITEMS_PER_PAGE = 0
export const DEFAULT_ITEMS_PER_ROW  = 0
export const DEFAULT_ITEMS_PER_COL  = 0
export const DEFAULT_PAGE_W         = 0 // pixels
export const DEFAULT_PAGE_H         = 0 // pixels
export const DEFAULT_PAGE_MARGIN_T  = 0 // pixels
export const DEFAULT_PAGE_MARGIN_R  = 0 // pixels
export const DEFAULT_PAGE_MARGIN_B  = 0 // pixels
export const DEFAULT_PAGE_MARGIN_L  = 0 // pixels
export const DEFAULT_ITEM_PADDING_X = 0 // pixels
export const DEFAULT_ITEM_PADDING_Y = 0 // pixels

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

// RASTER IMAGE OPTIONS

export const RASTER_IMAGE_PNG_TYPE = 'image/png'
// format must be specified as 'jpeg' not 'jpg'
export const RASTER_IMAGE_JPG_TYPE = 'image/jpeg'

export const DEFAULT_RASTER_IMAGE_AA      = false // antialiasing
export const DEFAULT_RASTER_IMAGE_W       = 0     // pixels
export const DEFAULT_RASTER_IMAGE_H       = 0     // pixels
export const DEFAULT_RASTER_IMAGE_TYPE    = RASTER_IMAGE_PNG_TYPE
export const DEFAULT_RASTER_IMAGE_QUALITY = 1     // (0 to 1) used for lossy formats

export const DEFAULT_RASTER_IMAGE_OPTIONS = {
    rasterImageAA     : DEFAULT_RASTER_IMAGE_AA,
    rasterImageW      : DEFAULT_RASTER_IMAGE_W,
    rasterImageH      : DEFAULT_RASTER_IMAGE_H,
    rasterImageType   : DEFAULT_RASTER_IMAGE_TYPE,
    rasterImageQuality: DEFAULT_RASTER_IMAGE_QUALITY
}

export async function svgToPNG(svg, options) {
    return _svgToRasterImage(svg, {...options, rasterImageType: RASTER_IMAGE_PNG_TYPE})
}

export async function svgToJPG(svg, options) {
    return _svgToRasterImage(svg, {...options, rasterImageType: RASTER_IMAGE_JPG_TYPE})
}

export async function svgToPDF(svg, options) {
    const img = await _svgToRasterImage(svg, options)
}

export function renderGameToSVG(game) {

}

export function renderGameToPNG(game) {

}

export function renderGameToJPG(game) {

}

export function renderGameToPDF(game) {

}

export async function renderComponentToSVG(game, component, template, options) {
    options = { ...DEFAULT_PAGE_OPTIONS, ...DEFAULT_UNIT_OPTIONS, ...options }
    _prepareComponent(game, component, template, options)
    _renderComponent (game, component, template, options)
    return await Promise.all(map(options.pages, async (page) => {
        return await _svgStringtoSVGImageElement(page.svg())
    }))
}

export async function renderComponentToPNG(game, component, template, options) {
    return svgToPNG(await renderComponentToSVG(game, component, template, options))
}

export async function renderComponentToJPG(game, component, template, options) {
    return svgToJPG(await renderComponentToSVG(game, component, template, options))
}

export async function renderComponentToPDF(game, component, template, options) {
    return svgToPDF(await renderComponentToSVG(game, component, template, options))
}

export async function renderItemToSVG(game, component, template, item, options) {
    options = { ...DEFAULT_PAGE_OPTIONS, ...DEFAULT_UNIT_OPTIONS, ...options }
    _prepareItem(game, component, template, item, options)
    _renderItem (game, component, template, item, options)
    return await _svgStringtoSVGImageElement(options.renderContext.svg())
}

export async function renderItemToPNG(game, component, template, item, options) {
    return svgToPNG(await renderItemToSVG(game, component, template, item, options))
}

export async function renderItemToJPG(game, component, template, item, options) {
    return svgToJPG(await renderItemToSVG(game, component, template, item, options))
}

export async function renderItemToPDF(game, component, template, item, options) {
    return svgToPDF(await renderItemToPNG(game, component, template, item, options))
}

function _prepareComponent(game, component, template, options) {
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
        return // fixed page size is less than minimum requirement!
    
    options['items'] = store.getters.getComponentItems(component)
    options['numberOfItems'] = options.items.length

    // if itemsPerPage is not defined
    if(!options.itemsPerPage)
        options.itemsPerPage = options.numberOfItems
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

    options['pages'] = [ ]
    options['numberOfPages'] = Math.ceil(options.numberOfItems / options.itemsPerPage)

    for(let page = 0; page < options.numberOfPages; page ++)
        options.pages.push(SVG().size(
            options.pageW,
            options.pageH,
        ))
}

function _renderComponent (game, component, template, options) {
    for(let item = 0; item < options.numberOfItems; item ++) {
        let page = Math.floor( item / options.itemsPerPage )
        let row  = Math.floor((item - options.itemsPerPage * page) / options.itemsPerRow      )
        let col  =            (item - options.itemsPerPage * page) - options.itemsPerRow * row

        options['renderContext'] = options.pages[page]
        options['renderOffsetX'] = options.pageMarginL + (options.itemW + options.itemPaddingX) * col
        options['renderOffsetY'] = options.pageMarginT + (options.itemH + options.itemPaddingY) * row
        _renderItem(game, component, template, options.items[item], options)
    }
}

function _prepareItem(game, component, template, item, options) {
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
        return // fixed page size is less than minimum requirement!

    options['items'] = [item]
    options['numberOfItems'] = 1

    options.itemsPerPage = 1
    options.itemsPerRow  = 1
    options.itemsPerCol  = 1

    if(!options.pageW)
        options.pageW = options.pageMarginL + options.pageMarginR + options.itemW
    if(!options.pageH)
        options.pageH = options.pageMarginT + options.pageMarginB + options.itemH

    options['pages'] = [SVG().size(
        options.pageW,
        options.pageH
    )]
    options['numberOfPages'] = 1
}

function _renderItem (game, component, template, item, options) {
    const rootContext = options.renderContext
    const itemContext = options.renderContext.nested()

    itemContext.move(
        options.renderOffsetX,
        options.renderOffsetY
    )
    itemContext.size(
        options.itemW,
        options.itemH
    )

    const layers = store.getters.findAllTemplateLayers(template)
    for(let layer of layers)
        _renderLayer(game, component, template, item, layer, {...options, renderContext: itemContext})
}

function _renderLayer(game, component, template, item, layer, options) {
    options = { ...options }

    switch(layer.type) {
        case TEXT_TYPE : return _renderTextLayer (game, component, template, item, layer, options)
        case IMAGE_TYPE: return _renderImageLayer(game, component, template, item, layer, options)
        case SHAPE_TYPE: return _renderShapeLayer(game, component, template, item, layer, options)
    }
}

function _renderTextLayer (game, component, template, item, layer, options) {
}

function _renderImageLayer(game, component, template, item, layer, options) {
}

function _renderShapeLayer(game, component, template, item, layer, options) {
}

// https://dev.to/benjaminblack/using-a-string-of-svg-as-an-image-source-8mo
function _svgStringtoSVGImageElement(svg) {
    return new Promise((resolve) => {
        const blob = new Blob([svg], {type: 'image/svg+xml'})
        const url = URL.createObjectURL(blob)
        const img = new Image()

        img.addEventListener('load', () => { 
            resolve(img) 
        })
        img.src = url
    })
}

function _svgToRasterImage(svg, options) {
    return new Promise( async (resolve) => {
        options = { ...DEFAULT_RASTER_IMAGE_OPTIONS, ...options }

        if(Array.isArray(svg)) {
            const imgs = [ ]
            for(let _svg of svg)
                imgs.push(await _svgToRasterImage(_svg, options))
            return resolve(imgs)
        }
    
        if(typeof svg === 'string')
            svg = await _svgStringtoSVGImageElement(svg)
    
        options.rasterImageW = options.rasterImageW || svg.width
        options.rasterImageH = options.rasterImageH || svg.height
    
        const context = document.createElement('canvas').getContext('2d', {
            antialias: options.rasterImageAA
        })
        context.canvas.width  = options.rasterImageW
        context.canvas.height = options.rasterImageH
    
        context.drawImage(
            svg,
            0, 0, svg.width           , svg.height          ,
            0, 0, options.rasterImageW, options.rasterImageH,
        )
    
        const img = new Image()
        img.addEventListener('load', () => {
            resolve(img)
        })
        img.src = context.canvas.toDataURL(
            options.rasterImageType   ,
            options.rasterImageQuality
        )
    })
}