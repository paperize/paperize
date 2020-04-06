import { find, forEach, isArray } from 'lodash'

// Keep renderers in their own files
import shape from './shape_renderer'
import text from './text_renderer'
import image from './image_renderer'

const RENDERERS = { shape, text, image }

export function renderItem(doc, item, parentDimensions) {
  // const selectedLayer = store.getters.layerHighlighting && store.getters.activeLayer

  if(!isArray(parentDimensions)) {
    parentDimensions = [ parentDimensions ]
  }

  // render each layer
  forEach(item.layers, layer => {
    // Always revert to defaults (so layer styles don't bleed into each other)
    layerDefaults(doc)

    forEach(parentDimensions, (dimensions) => {
      // what page is this item's location on?
      doc.setPage(dimensions.page)

      if(layer.visible) {
        // Type-specific layer renderers
        RENDERERS[layer.type].render(doc, layer)
      }
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
    strokeColor:   { r: 255, g: 0, b: 0 },
    fillPresent:   false,
  }

  RENDERERS.shape.render(doc, highlightLayer)
}
