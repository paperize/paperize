import { convert, INCHES, PIXELS, PERCENT_PARENT, DEFAULT_UNIT_OPTIONS, WH_MODE } from '../../util/units'

import { map, forEach } from 'lodash'
import * as  Bluebird from 'bluebird'

import store from '../../store'

import { SVG, Color } from '@svgdotjs/svg.js'

import { TEXT_TYPE }  from '../../models/text_layer'
import { IMAGE_TYPE } from '../../models/image_layer'
import { SHAPE_TYPE } from '../../models/shape_layer'
import { projectItem } from '../pdf_renderer/item_projector'
import { getImageById, getImageByName } from '../image_provider'
import { findProperty } from '../pdf_renderer/helpers'

// RENDER OPTIONS
export const RENDER_TARGET_SVG = 'render-target-svg'
export const RENDER_TARGET_PNG = 'render-target-png'
export const RENDER_TARGET_JPG = 'render-target-jpg'
export const RENDER_TARGET_PDF = 'render-target-pdf'

export const DEFAULT_RENDER_TARGET = RENDER_TARGET_SVG

export const DEFAULT_RENDER_OPTIONS = {
    renderTarget: RENDER_TARGET_SVG
}

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

// RASTER OPTIONS
export const RASTER_TARGET_PNG = 'image/png'
export const RASTER_TARGET_JPG = 'image/jpeg'

export const DEFAULT_RASTER_TARGET   = RASTER_TARGET_PNG
export const DEFAULT_RASTER_AA       = false
export const DEFAULT_RASTER_W        = 0
export const DEFAULT_RASTER_H        = 0
export const DEFAULT_RASTER_QUALITY  = 1

export const DEFAULT_RASTER_OPTIONS = {
    rasterTarget  : DEFAULT_RASTER_TARGET,
    rasterAA      : DEFAULT_RASTER_AA    ,
    rasterW       : DEFAULT_RASTER_W     ,
    rasterH       : DEFAULT_RASTER_H     ,
    rasterQuality : DEFAULT_RASTER_QUALITY
}

// PUBLIC INTERFACE
export const DEFAULT_OPTIONS = {
    ...DEFAULT_RENDER_OPTIONS,
    ...DEFAULT_PAGE_OPTIONS  ,
    ...DEFAULT_UNIT_OPTIONS  ,
    ...DEFAULT_RASTER_OPTIONS
}

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
    // return array
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

export async function renderComponent(game, component, template, options) {
    options = { ...DEFAULT_RENDER_OPTIONS, ...options }
    switch(options.renderTarget) {
        case RENDER_TARGET_SVG : return await renderComponentToSVG(game, component, template, options)
        case RENDER_TARGET_PNG : return await renderComponentToPNG(game, component, template, options)
        case RENDER_TARGET_JPG : return await renderComponentToJPG(game, component, template, options)
        case RENDER_TARGET_PDF : return await renderComponentToPDF(game, component, template, options)
    }
}

export async function renderComponentToSVG(game, component, template, options) {
    options = { ...DEFAULT_PAGE_OPTIONS, ...DEFAULT_UNIT_OPTIONS, ...options }
    // const items = store.getters.getComponentItems(component)
    // return array
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

export async function renderItems(game, component, template, item, options) {
    options = {... DEFAULT_RENDER_OPTIONS, ... options}
    switch(options.renderTarget) {
        case RENDER_TARGET_SVG : return await renderItemsToSVG(game, component, template, item, options)
        case RENDER_TARGET_PNG : return await renderItemsToPNG(game, component, template, item, options)
        case RENDER_TARGET_JPG : return await renderItemsToJPG(game, component, template, item, options)
        case RENDER_TARGET_PDF : return await renderItemsToPDF(game, component, template, item, options)
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
        case RENDER_TARGET_SVG : return renderItemToSVG(game, component, template, item, options)
        case RENDER_TARGET_PNG : return renderItemToPNG(game, component, template, item, options)
        case RENDER_TARGET_JPG : return renderItemToJPG(game, component, template, item, options)
        case RENDER_TARGET_PDF : return renderItemToPDF(game, component, template, item, options)
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

// PRIVATE API
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

    return map(new Array(numberOfPages), _ => {
        return SVG().size(
            options.pageW,
            options.pageH
        )
    })
}

function _prepareFonts(game, component, template, items, pages, options) {
    
}

async function _renderItems(game, component, template, items, pages, options) {
    for(let item = 0; item < items.length; item ++) {
        const page = Math.floor( item / options.itemsPerPage )
        const row  = Math.floor((item - options.itemsPerPage * page) / options.itemsPerRow      )
        const col  =            (item - options.itemsPerPage * page) - options.itemsPerRow * row

        options['itemOffsetX'] = options.pageMarginL + (options.itemW + options.itemPaddingX) * col
        options['itemOffsetY'] = options.pageMarginT + (options.itemH + options.itemPaddingY) * row
        await _renderItem(game, component, template, items[item], pages[page], options)
    }
}

async function _renderItem (game, component, template, item , page , options) {
    const layers = store.getters.findAllTemplateLayers(template)
    options['itemOffsetX'] = options.itemOffsetX || 0
    options['itemOffsetY'] = options.itemOffsetY || 0
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

    // page.rect(options.itemW, options.itemH).fill(Color.random())
    // forEach(layers, async (layer) => {
    //     _renderLayer(game, component, template, item, page, layer, options)
    // })
}

async function _renderLayer(game, component, template, item, page, layer, options) {
    if(!(layer = projectItem(layer, item)).visible) return;
    switch(layer.type) {
        case TEXT_TYPE : return await _renderTextLayer (game, component, template, item, page, layer, options)
        case IMAGE_TYPE: return await _renderImageLayer(game, component, template, item, page, layer, options)
        case SHAPE_TYPE: return await _renderShapeLayer(game, component, template, item, page, layer, options)
    }
}

async function _renderTextLayer (game, component, template, item, page, layer, options) {
    // we need to preload fonts... maybe this should be done in the _preparePages function
    // maybe run a separate _prepareFonts that acts on the pages to embed fonts
}



async function _renderImageLayer(game, component, template, item, page, layer, options) {
    let imagePromise

    if(layer.imageNameStatic) {
        // imageNameStatic can be set without providing an imageId for some reason
        if(!layer.imageId)
            return;
        imagePromise = getImageById(layer.imageId)
    } else {
        const 
            prefix = layer.imageNamePrefix,
            suffix = layer.imageNameSuffix,
            name   = findProperty(item, layer.imageNameProperty)
        imagePromise = getImageByName(`${prefix}${name}${suffix}`)
    }

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

    const image = await new Promise((resolve) => {
        const image = g.image(imagePath, () => {
            g.add( image )
            resolve(image)
        })
    })

    // define clipping region for image
    const clip = g.clip()
    clip.add(g.rect(w, h).move(x, y))
    g.clipWith(clip)

    let sx = w / image.width ()
    let sy = h / image.height()

    switch(layer.imageScaling) {
        case  'fitToBox' : sx = sy = Math.min(sx, sy); break;
        case 'fillToBox' : sx = sy = Math.max(sx, sy); break;
        case 'stretch': /* do nothing */
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
    // convert strokeWidth from inches (jsPDF default) to pixels
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

    // convert roundedRect radius from inches (jsPDF default) to pixels
    const R = convert(.1, INCHES, PIXELS, options)
    
    let shape
    // color does not support alpha channel, so opacity must be specified to enable transparency
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

// HELPER FUNCTIONS

async function _svgToPNG(url, options) {
    return await _svgToRasterImage(url, { ...options, rasterTarget: RASTER_TARGET_PNG})
}

async function _svgToJPG(url, options) {
    return await _svgToRasterImage(url, { ...options, rasterTarget: RASTER_TARGET_JPG})
}

async function _svgToPDF(url, options) {

}

async function _svgToRasterImage(url, options) {
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

        resolve(context.canvas.toDataURL(
            options.rasterTarget,
            options.rasterQuality
        ))
    })
}

async function _svgToImageElement(url) {
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
            resolve(image),
            { once: true }
        )
        image.src = url
    })
}


function _svgjsObjectToDataURL(svg) {
    if(Array.isArray(svg))
        return map(svg, i => _svgjsObjectToDataURL(i))
    return _svgjsStringToDataURL(svg.svg())
}

function _svgjsStringToDataURL(svg) {
    if(Array.isArray(svg))
        return map(svg, i => _svgjsStringToDataURL(i))
    return `data:image/svg+xml;base64,${btoa(svg)}`
}
