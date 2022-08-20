import { convert, INCHES, PIXELS, DEFAULT_UNIT_OPTIONS } from '../../util/units'

import store from '../../store'

import { SVG, Color } from '@svgdotjs/svg.js'

import { TEXT_TYPE }  from '../../models/text_layer'
import { IMAGE_TYPE } from '../../models/image_layer'
import { SHAPE_TYPE } from '../../models/shape_layer'
import { imageCacheCount } from '../image_cache'

// Page Options
export const DEFAULT_ITEMS_PER_PAGE = 0
export const DEFAULT_ITEMS_PER_ROW  = 0
export const DEFAULT_ITEMS_PER_COL  = 0
export const DEFAULT_PAGE_W         = 0
export const DEFAULT_PAGE_H         = 0
export const DEFAULT_PAGE_MARGIN_T  = 0
export const DEFAULT_PAGE_MARGIN_R  = 0
export const DEFAULT_PAGE_MARGIN_B  = 0
export const DEFAULT_PAGE_MARGIN_L  = 0
export const DEFAULT_ITEM_PADDING_X = 0
export const DEFAULT_ITEM_PADDING_Y = 0

export const DEFAULT_PAGE_OPTIONS = {
    itemsPerPage : DEFAULT_ITEMS_PER_PAGE,
    itemsPerRow  : DEFAULT_ITEMS_PER_ROW ,
    itemsPerCol  : DEFAULT_ITEMS_PER_COL ,
    pageW        : DEFAULT_PAGE_W, // page w in pixels
    pageH        : DEFAULT_PAGE_H, // page h in pixels
    pageMarginT  : DEFAULT_PAGE_MARGIN_T,
    pageMarginR  : DEFAULT_PAGE_MARGIN_R,
    pageMarginB  : DEFAULT_PAGE_MARGIN_B,
    pageMarginL  : DEFAULT_PAGE_MARGIN_L,
    itemPaddingX : DEFAULT_ITEM_PADDING_X,
    itemPaddingY : DEFAULT_ITEM_PADDING_Y
}

export const DEFAULT_RASTER_OUTPUT_AA      = false // antialiasing
export const DEFAULT_RASTER_OUTPUT_W       = 0
export const DEFAULT_RASTER_OUTPUT_H       = 0
export const DEFAULT_RASTER_OUTPUT_FORMAT  = 'image/png'
export const DEFAULT_RASTER_OUTPUT_QUALITY = 1

export const PNG_FORMAT = 'image/png'
export const JPG_FORMAT = 'image/jpg'
export const GIF_FORMAT = 'image/gif'

export const DEFAULT_RASTER_OUTPUT_OPTIONS = {
    rasterOutputAA     : DEFAULT_RASTER_OUTPUT_AA,     // antialiasing
    rasterOutputW      : DEFAULT_RASTER_OUTPUT_W,
    rasterOutputH      : DEFAULT_RASTER_OUTPUT_H,
    rasterOutputFormat : DEFAULT_RASTER_OUTPUT_FORMAT,
    rasterOutputQuality: DEFAULT_RASTER_OUTPUT_QUALITY // for compressed formats
}

export function renderGameToSVG(game) {

}

export function renderGameToPNG(game) {

}

export function renderGameToJPG(game) {

}

export function renderGameToGIF(game) {

}

export function renderGameToPDF(game) {

}

export async function renderComponentToSVG(game, component, template, options) {
    options = { ...DEFAULT_PAGE_OPTIONS, ...DEFAULT_UNIT_OPTIONS, ...options }
    
    // compute component size in pixels
    options['templateW'] = convert(template.size.w, INCHES, PIXELS, options)
    options['templateH'] = convert(template.size.h, INCHES, PIXELS, options)

    // compute effective page size (only query after checking if pageW or pageH is defined!)
    const effectivePageW = options.pageW - options.pageMarginL - options.pageMarginR
    const effectivePageH = options.pageH - options.pageMarginT - options.pageMarginB
    
    if(
        (options.pageW && effectivePageW < options.templateW) ||
        (options.pageH && effectivePageH < options.templateH)
    )
        return // fixed page size is less than minimum requirement!

    const items = store.getters.getComponentItems(component)

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
        options.pageW = options.pageMarginL + options.pageMarginR - options.itemPaddingX + (options.templateW + options.itemPaddingX) * options.itemsPerRow
        options.pageH = options.pageMarginT + options.pageMarginB - options.itemPaddingY + (options.templateH + options.itemPaddingY) * options.itemsPerCol
    // if page size is partially undefined where only pageW is defined
    } else if( options.pageW && !options.pageH) {
        // then compute maxItemsPerRow
        const maxItemsPerRow = Math.floor((effectivePageW - options.itemPaddingX) / (options.templateW + options.itemPaddingX))
        // enforce upper bound on itemsPerRow
        options.itemsPerRow = Math.min(options.itemsPerRow, maxItemsPerRow) || maxItemsPerRow
        // derive itemsPerCol using itemsPerPage and itemsPerRow
        options.itemsPerCol = Math.floor(options.itemsPerPage / options.itemsPerRow)
        // compute pageH using grid layout
        options.pageH = options.pageMarginT + options.pageMarginB - options.itemPaddingY + (options.templateH + options.itemPaddingY) * options.itemsPerCol
    // if page size is partially undefined where only pageH is defined
    } else if(!options.pageW &&  options.pageH) {
        // then compute maxItemsPerCol
        const maxItemsPerCol = Math.floor((effectivePageH - options.itemPaddingY) / (options.templateH + options.itemPaddingY))
        // enforce upper bound on itemsPerCol
        options.itemsPerCol = Math.min(options.itemsPerCol, maxItemsPerCol) || maxItemsPerCol
        // derive itemsPerRow using itemsPerPage and itemsPerCol
        options.itemsPerRow = Math.floor(options.itemsPerPage / options.itemsPerCol)
        // compute pageW using grid layout
        options.pageW = options.pageMarginL + options.pageMarginR - options.itemPaddingX + (options.templateW + options.itemPaddingX) * options.itemsPerRow
    // if page size is well defined
    } else {
        // then compute upper bounds for grid layout
        const maxItemsPerRow  = Math.floor((effectivePageW - options.itemPaddingX) / (options.templateW + options.itemPaddingX))
        const maxItemsPerCol  = Math.floor((effectivePageH - options.itemPaddingY) / (options.templateH + options.itemPaddingY))
        
        // enforce upper bounds for grid layout
        options.itemsPerRow  = Math.min(options.itemsPerRow , maxItemsPerRow ) || maxItemsPerRow
        options.itemsPerCol  = Math.min(options.itemsPerCol , maxItemsPerCol ) || maxItemsPerCol

        // compute maxItemsPerPage
        const maxItemsPerPage = options.itemsPerRow * options.itemsPerCol
        // enforce upper bound on maxItemsPerPage
        options.itemsPerPage = Math.min(options.itemsPerPage, maxItemsPerPage)
    }    

    options['numberOfPages'] = Math.ceil(items.length / options.itemsPerPage)
    const pages = [ ]

    for(let page = 0; page < options.numberOfPages; page ++)
        pages.push(SVG().size(
            options.pageW,
            options.pageH,
        ))

    for(let item = 0; item < items.length; item ++) {
        let page = Math.floor( item / options.itemsPerPage )
        let row  = Math.floor((item - options.itemsPerPage * page) / options.itemsPerRow      )
        let col  =            (item - options.itemsPerPage * page) - options.itemsPerRow * row

        options['renderContext' ] = pages[page]
        options['renderOffsetX'] = options.pageMarginL + (options.templateW + options.itemPaddingX) * col
        options['renderOffsetY'] = options.pageMarginT + (options.templateH + options.itemPaddingY) * row
        renderItem(game, component, template, items[item], options)
    }
    
    // for(let page = 0; page < options.numberOfPages; page ++) {
    //     for(let row = 0; row < options.itemsPerCol; row ++) {
    //         for(let col = 0; col < options.itemsPerRow; col ++) {
    //             let item = (page * options.itemsPerPage) + (row * options.itemsPerCol) + col
    //             options['renderContext' ] = pages[page]
    //             options['renderOffsetX'] = options.pageMarginL + (options.templateW + options.itemPaddingX) * col
    //             options['renderOffsetY'] = options.pageMarginT + (options.templateH + options.itemPaddingY) * row
    //             renderItemToSVG(game, component, template, items[item], options)
    //         }
    //     }
    // }
    const svgs = [ ]
    for(let page of pages)
        svgs.push(await svgStringToSVGImageElement(page.svg()))
    return svgs
}

export async function renderComponentToPNG(game, component, template, options) {
    return svgToPNG(await renderComponentToSVG(game, component, template, options))
}

export async function renderComponentToJPG(game, component, template, options) {
    return svgToJPG(await renderComponentToSVG(game, component, template, options))
}

export async function renderComponentToGIF(game, component, template, options) {
    return svgToGIF(await renderComponentToSVG(game, component, template, options))
}

export async function renderComponentToPDF(game, component, template, options) {
    return svgToPDF(await renderComponentToSVG(game, component, template, options))
}

export async function renderItemToSVG(game, component, template, item, options) {
    options = { ...DEFAULT_PAGE_OPTIONS, ...DEFAULT_UNIT_OPTIONS, ...options }
    renderItem(game, component, template, item, options)
    return svgStringToSVGImageElement(options.renderContext.svg())
}

export async function renderItemToPNG(game, component, template, item, options) {
    return svgToPNG(await renderItemToSVG(game, component, template, item, options))
}

export async function renderItemToJPG(game, component, template, item, options) {
    return svgToJPG(await renderItemToSVG(game, component, template, item, options))
}

export async function renderItemToGIF(game, component, template, item, options) {
    return svgToGIF(await renderItemToSVG(game, component, template, item, options))
}

export async function renderItemToPDF(game, component, template, item, options) {
    return svgToPDF(await renderItemToPNG(game, component, template, item, options))
}

function renderItem(game, component, template, item, options) {
    if(!options.renderContext) {
        // compute component size in pixels
        options['templateW'] = convert(template.size.w, INCHES, PIXELS, options)
        options['templateH'] = convert(template.size.h, INCHES, PIXELS, options)
        options['renderContext'] = SVG().size(
            options.templateW,
            options.templateH
        )
        options['renderOffsetX'] = 0
        options['renderOffsetY'] = 0
    }

    const rootContext = options.renderContext
    const itemContext = options.renderContext.nested()

    itemContext.move(
        options.renderOffsetX,
        options.renderOffsetY
    )
    itemContext.size(
        options.templateW,
        options.templateH
    )

    const layers = store.getters.findAllTemplateLayers(template)
    for(let layer of layers)
        renderLayer(game, component, template, item, layer, {...options, renderContext: itemContext})
}

function renderLayer(game, component, template, item, layer, options) {
    options = { ...options }

    switch(layer.type) {
        case TEXT_TYPE : return renderTextLayer (game, component, template, item, layer, options)
        case IMAGE_TYPE: return renderImageLayer(game, component, template, item, layer, options)
        case SHAPE_TYPE: return renderShapeLayer(game, component, template, item, layer, options)
    }
}

function renderTextLayer (game, component, template, item, layer, options) {
    const context = options.renderContext.nested()
}

function renderImageLayer(game, component, template, item, layer, options) {
    const context = options.renderContext.nested()
}

function renderShapeLayer(game, component, template, item, layer, options) {
    const context = options.renderContext.nested()
}

// https://dev.to/benjaminblack/using-a-string-of-svg-as-an-image-source-8mo
function svgStringToSVGImageElement(svg) {
    return new Promise((resolve, reject) => {
        const blob = new Blob([svg], {type: 'image/svg+xml'})
        const url = URL.createObjectURL(blob)
        const img = new Image()

        img.addEventListener('load', () => { resolve(img) } )

        img.src = url
    })
}

export async function svgToPNG(svg, options) {
    return svgToIMG(svg, {...options, rasterOutputFormat: PNG_FORMAT})
}

export async function svgToJPG(svg, options) {
    return svgToIMG(svg, {...options, rasterOutputFormat: JPG_FORMAT})
}

export async function svgToGIF(svg, options) {
    return svgToIMG(svg, {...options, rasterOutputFormat: GIF_FORMAT})
}

export async function svgToPDF(svg, options) {
    const img = await svgToIMG(svg, options)
}

function svgToIMG(svg, options) {
    options = { ...DEFAULT_RASTER_OUTPUT_OPTIONS, ...options }

    return new Promise( async (resolve, reject) => {
        if(Array.isArray(svg)) {
            const imgs = [ ]
            for(let _svg of svg)
                imgs.push(await svgToIMG(_svg))
            return resolve(imgs)
        }
    
        if(typeof svg === 'string')
            svg = await svgStringToSVGImageElement(svg)
    
        options.rasterOutputW = options.rasterOutputW || svg.width
        options.rasterOutputH = options.rasterOutputH || svg.height
    
        const context = document.createElement('canvas').getContext('2d', {
            antialias: options.rasterOutputAA
        })
        context.canvas.width  = options.rasterOutputW
        context.canvas.height = options.rasterOutputH
    
        context.drawImage(
            svg,
            0, 0, svg.width            , svg.height           ,
            0, 0, options.rasterOutputW, options.rasterOutputH,
        )
    
        const img = new Image()
        img.addEventListener('load', () => {
            resolve(img)
        })
        img.src = context.canvas.toDataURL(
            options.rasterOutputFormat ,
            options.rasterOutputQuality
        )
    })
}