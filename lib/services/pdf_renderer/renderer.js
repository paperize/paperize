import { isArray } from 'lodash'
import store from '../../store' // TODO: stop including this directly
import { percentOfParent } from './helpers'

// Keep renderers in their own files
import shape from './shape_renderer'
import text from './text_renderer'
import image from './image_renderer'
import { projectItem } from './item_projector'

const RENDERERS = { shape, text, image }

export function renderItem(doc, game, component, item, parentDimensions, index, total) {
  // get layers for this component
  const template = store.getters.findTemplate(component.templateId),
    layers = store.getters.findAllTemplateLayers(template),
    selectedLayer = store.getters.activeLayer

  if(!isArray(parentDimensions)) {
    parentDimensions = [ parentDimensions ]
  }

  // render each layer
  return Promise.each(layers, layer => {
    // Always revert to defaults (so layer styles don't bleed into each other)
    layerDefaults(doc)

    return Promise.each(parentDimensions, (dimensions) => {
      // what page is this item's location on?
      doc.setPage(dimensions.page)

      // TODO: modify with layout dimensions
      const
        layerDimensions = percentOfParent(store.getters.getLayerDimensions(layer), dimensions),
        // Magic properties from the source affect layer defaults
        projectedLayer = projectItem(layer, item)

      if(projectedLayer.visible) {
        // Type-specific layer renderers
        return RENDERERS[projectedLayer.type].render(doc, projectedLayer, layerDimensions, item, index, total)
      } else {
        return Promise.resolve()
      }
    })
  }).then(() => {
    if(selectedLayer && store.getters.layerHighlighting) {
      renderHighlightLayer(doc, selectedLayer, parentDimensions[0])
    }
  })
}

export function layerDefaults(doc) {
  doc.setFontSize(16)
  doc.setLineWidth(.02)
  doc.setDrawColor(0)
  doc.setFillColor(0)
}

export function renderHighlightLayer(doc, selectedLayer, parentDimensions) {
  const layerDimensions = percentOfParent(store.getters.getLayerDimensions(selectedLayer), parentDimensions),
    // Minimum shape layer needed for a thin, red rectangle
    highlightLayer = {
      shape:         "rectangle",
      strokePresent: true,
      strokeWidth:   0.02,
      strokeColor:   { r: 255, g: 0, b: 0 },
      fillPresent:   false,
    }

  RENDERERS.shape.render(doc, highlightLayer, layerDimensions, {}, 0, 0)
}
