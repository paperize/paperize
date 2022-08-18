import { convert, INCHES, PIXELS, DEFAULT_UNIT_OPTIONS } from '../../util/units'

import store from '../../store'

import { SVG } from '@svgdotjs/svg.js'

import { TEXT_TYPE }  from '../../models/text_layer'
import { IMAGE_TYPE } from '../../models/image_layer'
import { SHAPE_TYPE } from '../../models/shape_layer'

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

export function svgToPNG(svg, options) {

}

export function pngToPDF(png, options) {

}

export function renderGameToSVG(game) {
    const svgs = [ ]


}

export function renderGameToPNG(game) {
    const svgs = renderGameToSVG(game)
    const pngs = [ ]
    for(let svg of svgs)
        pngs.push(svgToPNG(svg))
}

export function renderGameToPDF(game) {
    const pngs = renderGameToPNG(game)
    const pdfs = [ ]
    for(let png of pngs)
        pdfs.push(pngToPDF(png))
    return pdfs
}

export function renderComponentToSVG(game, component, template, options) {
    options = { ...DEFAULT_PAGE_OPTIONS, ...DEFAULT_UNIT_OPTIONS, ...options }
    
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

    const items = store.getters.getComponentItems(component)

    // if itemsPerPage is not defined
    if(!options.itemsPerPage)
        options.itemsPerPage = items.length
    // if page size is undefined
    if(!options.pageW && !options.pageH) {
        // if grid layout is undefined
        if(!options.itemsPerRow && !options.itemsPerCol) {
            // then compute 'square' grid layout
            options.itemsPerRow = Math.floor(Math.sqrt(options.itemsPerPage))
            options.itemsPerCol = Math.ceil (Math.sqrt(options.itemsPerPage))
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
        options.pageW = options.pageMarginL + options.pageMarginR - options.itemSpacingX + (options.itemW + options.itemPaddingX) * options.itemsPerRow
        options.pageH = options.pageMarginT + options.pageMarginB - options.itemSpacingY + (options.itemH + options.itemPaddingY) * options.itemsPerCol
    // if page size is partially undefined where only pageW is defined
    } else if( options.pageW && !options.pageH) {
        // then compute maxItemsPerRow
        const maxItemsPerRow = Math.floor((effectivePageW - options.itemPaddingX) / (options.itemW + options.itemPaddingX))
        // enforce upper bound on itemsPerRow
        options.itemsPerRow = Math.min(options.itemsPerRow, maxItemsPerRow) || maxItemsPerRow
        // derive itemsPerCol using itemsPerPage and itemsPerRow
        options.itemsPerCol = Math.floor(options.itemsPerPage / options.itemsPerRow)
        // compute pageH using grid layout
        options.pageH = options.pageMarginT + options.pageMarginB - options.itemSpacingY + (options.itemH + options.itemPaddingY) * options.itemsPerCol
    // if page size is partially undefined where only pageH is defined
    } else if(!options.pageW &&  options.pageH) {
        // then compute maxItemsPerCol
        const maxItemsPerCol = Math.floor((effectivePageH - options.itemPaddingY) / (options.itemH + options.itemPaddingY))
        // enforce upper bound on itemsPerCol
        options.itemsPerCol = Math.min(options.itemsPerCol, maxItemsPerCol) || maxItemsPerCol
        // derive itemsPerRow using itemsPerPage and itemsPerCol
        options.itemsPerRow = Math.floor(options.itemsPerPage / options.itemsPerCol)
        // compute pageW using grid layout
        options.pageW = options.pageMarginL + options.pageMarginR - options.itemSpacingX + (options.itemW + options.itemPaddingX) * options.itemsPerRow
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

    options['numberOfPages'] = Math.ceil(items.length / options.itemsPerPage)
    const pages = [ ]

    for(let page = 0; page < options.numberOfPages; page ++)
        pages.push(SVG().size(
            options.pageW,
            options.pageH,
        ).svg())
    
    for(let page = 0; page < options.numberOfPages; page ++) {
        for(let row = 0; row < options.itemsPerCol; row ++) {
            for(let col = 0; col < options.itemsPerRow; col ++) {
                let item = (page * options.itemsPerPage) + (row * options.itemsPerCol) + col
                options['renderTarget' ] = pages[page]
                options['renderOffsetX'] = options.pageMarginL + (options.itemW + options.itemSpacingX) * col
                options['renderOffsetY'] = options.pageMarginT + (options.itemH + options.itemSpacingY) * row
                renderItemToSVG(game, component, template, items[item], options)
            }
        }
    }
}

export function renderComponentToPNG(game, component, template, options) {
    const svgs = renderComponentToSVG(game, component, template, options)
}

export function renderComponentToPDF(game, component, template, options) {
    const pngs = renderComponentToPNG(game, component, template, options)
}

export function renderItemToSVG(game, component, template, item, options) {
    options = { ...DEFAULT_PAGE_OPTIONS, ...DEFAULT_UNIT_OPTIONS, ...options }
    if(!options.renderTarget) {
        // create a render target
    }

    const layers = store.getters.findAllTemplateLayers(template)
    for(let layer of layers)
        renderLayerToSVG(game, component, template, item, layer, options)
}

export function renderItemToPNG(game, component, template, item, options) {
    const svg = renderItemToSVG(game, component, template, item, options)
}

export function renderItemToPDF(game, component, template, item, options) {
    const png = renderItemToPNG(game, component, template, item, options)
}

function renderLayerToSVG(game, component, template, item, layer, options) {
    switch(layer.type) {
        case TEXT_TYPE : return renderTextLayerToSVG (game, component, template, item, layer, options)
        case IMAGE_TYPE: return renderImageLayerToSVG(game, component, template, item, layer, options)
        case SHAPE_TYPE: return renderShapeLayerToSVG(game, component, template, item, layer, options)
    }
}

function renderTextLayerToSVG(game, component, template, item, page, layer, options) {

}

function renderImageLayerToSVG(game, component, template, item, page, layer, options) {

}

function renderShapeLayerToSVG(game, component, template, item, page, layer, options) {

}