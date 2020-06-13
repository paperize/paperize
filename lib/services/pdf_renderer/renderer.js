import { find, forEach, isArray } from 'lodash'

// Keep renderers in their own files
import shape from './shape_renderer'
import text from './text_renderer'
import image from './image_renderer'

const RENDERERS = { shape, text, image }

export function renderItem(doc, item) {
  // const selectedLayer = store.getters.layerHighlighting && store.getters.activeLayer

  if(item.location && !item.locations) {
    item.locations = [item.location]
  }

  // render each layer
  forEach(item.layers, layer => {
    if(!layer.visible) { return }
    // Always revert to defaults (so layer styles don't bleed into each other)
    layerDefaults(doc)

    forEach(item.locations, (dimensions) => {
      // what page is this item's location on?
      doc.setPage(dimensions.page)

      // what position on the page?
      // do this non-destructively because the same layer can be rendered
      // multiple times when the item is larger than the print medium
      const translatedLayer = {
        ...layer,
        dimensions: {
          ...layer.dimensions,
          x: layer.dimensions.x + dimensions.x,
          y: layer.dimensions.y + dimensions.y,
        }
      }

      // Type-specific layer renderers
      RENDERERS[layer.type].render(doc, translatedLayer)
    })
  })

  const selectedLayer = find(item.layers, "selectedLayer")

  if(selectedLayer) {
    renderHighlightLayer(doc, selectedLayer)
  }
}

export function layerDefaults(doc) {
  doc.setFontSize(16)
  doc.setLineWidth(.02)
  doc.setDrawColor(0)
  doc.setFillColor(0)
}

export function renderHighlightLayer(doc, selectedLayer) {
  // Minimum shape layer needed for a thin, red rectangle
  const highlightLayer = {
    dimensions:    selectedLayer.dimensions,
    shape:         "rectangle",
    strokePresent: true,
    strokeWidth:   0.02,
    strokeColor:   { rgbObject: { r: 255, g: 0, b: 0 } },
    fillPresent:   false,
  }

  RENDERERS.shape.render(doc, highlightLayer)
}
