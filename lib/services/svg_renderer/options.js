/******************/
/* RENDER OPTIONS */
/******************/
export const RENDER_TARGET = {
  SVG: RENDER_TARGET_SVG,
  PNG: RENDER_TARGET_PNG,
  JPG: RENDER_TARGET_JPG,
  PDF: RENDER_TARGET_PDF
}
export const RENDER_TARGET_SVG = 'image/svg+xml'
export const RENDER_TARGET_PNG = 'image/png'
export const RENDER_TARGET_JPG = 'image/jpeg'
export const RENDER_TARGET_PDF = 'application/pdf'

export const DEFAULT_RENDER_TARGET  = RENDER_TARGET_SVG
export const DEFAULT_RENDER_OPTIONS = {
  renderTarget: DEFAULT_RENDER_TARGET,

  game      : undefined,
  components: undefined,
  component : undefined,
  template  : undefined,
  items     : undefined,
  item      : undefined,
}

/****************/
/* PAGE OPTIONS */
/****************/

export const DEFAULT_ITEMS_PER_PAGE = 0
export const DEFAULT_ITEMS_PER_ROW  = 0
export const DEFAULT_ITEMS_PER_COL  = 0
export const DEFAULT_PAGE_W         = 0 // pixels
export const DEFAULT_PAGE_H         = 0 // pixels
export const DEFAULT_PAGE_MARGIN_T  = 0 // pixels
export const DEFAULT_PAGE_MARGIN_R  = 0 // pixels
export const DEFAULT_PAGE_MARGIN_B  = 0 // pixels
export const DEFAULT_PAGE_MARGIN_L  = 0 // pixels
export const DEFAULT_ITEM_PADDING_T = 0 // pixels
export const DEFAULT_ITEM_PADDING_R = 0 // pixels
export const DEFAULT_ITEM_PADDING_B = 0 // pixels
export const DEFAULT_ITEM_PADDING_L = 0 // pixels

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
  itemPaddingT : DEFAULT_ITEM_PADDING_T,
  itemPaddingR : DEFAULT_ITEM_PADDING_R,
  itemPaddingB : DEFAULT_ITEM_PADDING_B,
  itemPaddingL : DEFAULT_ITEM_PADDING_L,
}

/******************/
/* RASTER OPTIONS */
/******************/

export const DEFAULT_RASTER_W       = 0
export const DEFAULT_RASTER_H       = 0
export const DEFAULT_RASTER_AA      = 0
export const DEFAULT_RASTER_QUALITY = 1

export const DEFAULT_RASTER_OPTIONS = {
  rasterW       : DEFAULT_RASTER_W     ,
  rasterH       : DEFAULT_RASTER_H     ,
  rasterAA      : DEFAULT_RASTER_AA    ,
  rasterQuality : DEFAULT_RASTER_QUALITY
}





