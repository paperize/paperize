export function loadFont(jsPDFAPI, fontName, fontVariant, fontBase64) {
  var callAddFont = function () {
    let fontIndexName = `${fontName}-${fontVariant}.ttf`
    this.addFileToVFS(fontIndexName, fontBase64)
    this.addFont(fontIndexName, fontName, fontVariant)
  }

  jsPDFAPI.events.push(['addFonts', callAddFont])
}
