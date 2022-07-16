<template lang="pug">
//- iframe(:src="pdfBlob") eliminate warnings in chrome
object(:data="pdfBlob" type="application/pdf")
//- embed(:src="pdfBlob" width="100%" height="100%" name="plugin" id="plugin" type="application/pdf")
</template>

<script>
  import { debounce } from 'lodash'
  import { mapGetters } from 'vuex'
  import pdfRenderer from '../../services/pdf_renderer'

  const RENDER_DELAY_MS = 600

  export default {
    props: ["game", "component", "item"],

    mounted() { this.renderPDF() },

    data() {
      return {
        pdfBlob: null
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
      game: "renderPDF",
      component: "renderPDF",
      item: "renderPDF",
      // Computed
      activeDimensions: "renderPDF",
      templateLayers: "renderPDF",
      activeLayer: "renderPDF",
      layerStrokePresent: "renderPDF",
      layerStrokeWidth: "renderPDF",
      layerStrokeColor: "renderPDF",
      layerFillPresent: "renderPDF",
      layerFillColor: "renderPDF",
      layerImageNameStatic: "renderPDF",
      layerImageName: "renderPDF",
      layerImageNamePrefix: "renderPDF",
      layerVisible: "renderPDF",
      layerImageNameProperty: "renderPDF",
      layerImageNameSuffix: "renderPDF",
      layerImageScaling: "renderPDF",
      layerHorizontalAlignment: "renderPDF",
      layerVerticalAlignment: "renderPDF",
      layerTextContentTemplate: "renderPDF",
      layerTextColor: "renderPDF",
      layerTextSize: "renderPDF",
      layerHighlighting: "renderPDF",
      allFonts: "renderPDF"
    },

    methods: {
      renderPDF: debounce(function() {
        if(this.game && this.component && this.item && this.componentTemplate) {
          pdfRenderer.renderItemToPdf(this.game, this.component, this.item, this.componentTemplate).then((pdf) => {
            this.pdfBlob = pdf
          })
        }
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
