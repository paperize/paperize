<template lang="pug">
div(v-if="exportFormat == 'pdf'")
  iframe(v-if="isSafari" :src="pdfBlob")
  object(v-else :data="pdfBlob" type="application/pdf")
  //- embed(:src="pdfBlob" width="100%" height="100%" name="plugin" id="plugin" type="application/pdf")

div(v-else-if="exportFormat == 'jpg'")
  img(:src="jpgData")

div(v-else-if="exportFormat == 'png'")
  img(:src="pngData")

div(v-else-if="exportFormat == 'svg'")
  img(:src="svgData")
  //- div(v-html="svgString")

</template>

<script>
import { debounce } from 'lodash'
import { mapGetters } from 'vuex'
import pdfRenderer from '../../services/pdf_renderer'
import { renderItemToPDF, renderItemToPNG, renderItemToSVG, renderItemToJPG } from '../../services/svg_renderer'

const RENDER_DELAY_MS = 250

// quick/dirty useragent detection
const
  userAgent = navigator.userAgent.toLowerCase(),
  isChrome = userAgent.indexOf('chrome') > -1,
  isSafari = !isChrome && userAgent.indexOf('safari/') > -1

export default {
  props: ["exportFormat", "game", "component", "item"],

  mounted() { this.rerender() },

  data() {
    return {
      isSafari,
      isChrome,
      pdfBlob: null,
      svgData: null,
      pngData: null,
      jpgData: null,
    }
  },

  computed: {
    ...mapGetters([
      "activeDimensions",
      "activeLayer",
      "findComponentTemplate",
      "findAllTemplateLayers",
      "layerHighlighting",
      "allFonts"
    ]),

    layerVisible() { return (this.activeLayer && this.activeLayer.visible ) },
    layerStrokePresent() { return (this.activeLayer && this.activeLayer.strokePresent) },
    layerStrokeWidth() { return (this.activeLayer && this.activeLayer.strokeWidth) },
    layerStrokeColor() { return (this.activeLayer && this.activeLayer.strokeColor) },
    layerFillPresent() { return (this.activeLayer && this.activeLayer.fillPresent) },
    layerFillColor() { return (this.activeLayer && this.activeLayer.fillColor) },

    layerImageNameStatic() { return (this.activeLayer && this.activeLayer.imageNameStatic) },
    layerImageId() { return (this.activeLayer && this.activeLayer.imageId) },
    layerImageNamePrefix() { return (this.activeLayer && this.activeLayer.imageNamePrefix) },
    layerImageNameProperty() { return (this.activeLayer && this.activeLayer.imageNameProperty) },
    layerImageNameSuffix() { return (this.activeLayer && this.activeLayer.imageNameSuffix) },
    layerImageScaling() { return (this.activeLayer && this.activeLayer.imageScaling) },
    layerHorizontalAlignment() { return (this.activeLayer && this.activeLayer.horizontalAlignment) },
    layerVerticalAlignment() { return (this.activeLayer && this.activeLayer.verticalAlignment) },

    layerTextContentTemplate() { return (this.activeLayer && this.activeLayer.textContentTemplate) },
    layerTextColor() { return (this.activeLayer && this.activeLayer.textColor) },
    layerTextSize() { return (this.activeLayer && this.activeLayer.textSize) },

    componentTemplate() { return this.findComponentTemplate(this.component) },

    templateLayers() { return this.findAllTemplateLayers(this.componentTemplate) }
  },

  watch: {
    // Props
    exportFormat: "rerender",
    game: "rerender",
    component: "rerender",
    item: "rerender",
    // Computed
    activeDimensions: "rerender",
    templateLayers: "rerender",
    activeLayer: "rerender",
    layerStrokePresent: "rerender",
    layerStrokeWidth: "rerender",
    layerStrokeColor: "rerender",
    layerFillPresent: "rerender",
    layerFillColor: "rerender",
    layerImageNameStatic: "rerender",
    layerImageName: "rerender",
    layerImageNamePrefix: "rerender",
    layerVisible: "rerender",
    layerImageNameProperty: "rerender",
    layerImageNameSuffix: "rerender",
    layerImageScaling: "rerender",
    layerHorizontalAlignment: "rerender",
    layerVerticalAlignment: "rerender",
    layerTextContentTemplate: "rerender",
    layerTextColor: "rerender",
    layerTextSize: "rerender",
    layerHighlighting: "rerender",
    allFonts: "rerender"
  },

  methods: {
    rerender() {
      if(!this.game || !this.component || !this.item || !this.componentTemplate) { return }

      switch(this.exportFormat){
      case 'pdf':
        this.renderPDF()
        break
      case 'jpg':
        this.renderJPG()
        break
      case 'png':
        this.renderPNG()
        break
      case 'svg':
        this.renderSVG()
        break
      default:
        throw new Error(`Unrecognized Render Format: ${this.exportFormat}`)
      }
    },

    async renderJPG() {
      this.jpgData = await renderItemToJPG(this.game, this.component, this.componentTemplate, this.item)
    },

    async renderPNG() {
      this.pngData = await renderItemToPNG(this.game, this.component, this.componentTemplate, this.item)
    },

    async renderSVG() {
      this.svgData = await renderItemToSVG(this.game, this.component, this.componentTemplate, this.item)
    },

    renderPDF: debounce(async function() {
      // this.pdfBlob = await renderItemToPDF(this.game, this.component, this.componentTemplate, this.item)

      this.pdfBlob = await pdfRenderer.renderItemToPdf(this.game, this.component, this.item, this.componentTemplate)
    }, RENDER_DELAY_MS)
  }
}
</script>

<style scoped>
  iframe, object, embed {
    width: 100%;
    min-height: 400px;
  }
</style>
