renderPdfFromTemplate(game, template) {
  // don't know what unit to work in, probably should be plugable as well
  let doc = startNewDocumentFor(game, template)
  let items = sortGameItems(game)
  items.each((item) => {
    addPage(doc, template, game)
    renderItem(doc, template, item, items, game)
  })
}

openDocument(game, template) {
  // Allow template to override
  // template.newDocumentOptions?
  const doc = new jsPDF({ unit: 'in' })
  // Clear the auto-generated page
  doc.deletePage(1)

  return doc
}

addPage(doc, template, game) {
  // game or template knows page settings?
  // template.pageArguments?
  // doc.apply('addPage', template.pageArguments)
  doc.addPage(2.5, 3.5)
}

sortGameItems(game) {
  // sort game items before iteration, affects printing order
  // let items = game.items.sortBy('order')
  // or default to simple iteration
  return game.items
}

renderItem(doc, item, items, game) {
  renderBackgroundTemplates()
  renderPerPropertyTemplates()
  renderForegroundTemplates()

  // Do whatever you want here:
  // - write to the pdf with the doc object
  // - doc, game, items, item all in scope, all useful
  // - item is what you're currently drawing
  // - items is the whole collection item is a part of
  // - game is the whole game
}

renderBackgroundTemplates() {

}

renderPerPropertyTemplates() {

}

renderForegroundTemplates() {

}

propertyTemplate("title", (title, doc) => {
  failUnless("text")

  doc.setColor(color)
  doc.setFont(font)
  doc.renderText(title, x, y)
})

propertyTemplate("cost", (cost, doc) => {
  failUnless("template")

  doc.setColor(color)
  doc.setFont(font)
  doc.renderText(cost(), x, y)
})

propertyTemplate("image", (image, doc) => {
  failUnless("image")

  // implement stretch/crop to fit/fill

  doc.addImage(image, x, y)
})
