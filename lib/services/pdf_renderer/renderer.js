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
  const
    template = store.getters.findTemplate(component.templateId),
    layers = store.getters.findAllTemplateLayers(template),
    selectedLayer = store.getters.activeLayer,
    results = { operations: [], issues: [] }

  if(!isArray(parentDimensions)) {
    parentDimensions = [ parentDimensions ]
  }

  // render each layer
  return Bluebird.each(layers, layer => {
    // Always revert to defaults (so layer styles don't bleed into each other)
    layerDefaults(doc)

    return Bluebird.each(parentDimensions, (dimensions) => {
      // TODO: modify with layout dimensions
      // Magic properties from the source affect layer defaults
      const projectedLayer = projectItem(layer, item)

      // early out for hidden layers
      if(!projectedLayer.visible) { return Promise.resolve() }

      const
        layerDimensions = percentOfParent(store.getters.getLayerDimensions(layer), dimensions),
        layerRenderer = RENDERERS[projectedLayer.type]

      // what page is this item's location on?
      doc.setPage(dimensions.page)

      // Type-specific layer renderers
      return Promise.resolve(layerRenderer.render(doc, projectedLayer, layerDimensions, item, index, total))
        .catch(error => {
          results.issues.push(error.message || error)
        })
    })
  }).then(() => {
    if(selectedLayer && store.getters.layerHighlighting) {
      renderHighlightLayer(doc, selectedLayer, parentDimensions[0])
    }
  }).then(() => results)
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
