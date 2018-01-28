

export default {
  render(doc, layer, layerDimensions) {
    if(!layer.renderFunction) { return }

    let actualFunction
    // Let the fires of hell erupt
    eval(`actualFunction = function(doc, helpers, dimensions, game, component, item) {
      ${layer.renderFunction}
    }`)

    return actualFunction(doc, helpers, layerDimensions, game, component, item)
  }
}
