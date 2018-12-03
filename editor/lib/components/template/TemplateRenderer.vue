<template lang="pug">
  iframe(:src="pdfBlob")
</template>

<script>
  import { debounce, reduce } from 'lodash'
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
      ...mapGetters(["activeDimensions", "activeLayer"]),

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

      templateLayers() {
        let template = this.$store.getters.findTemplate(this.component.templateId)
        return this.$store.getters.findAllTemplateLayers(template)
      }
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
      layerImageNameProperty: "renderPDF",
      layerImageNameSuffix: "renderPDF",
      layerImageScaling: "renderPDF",
      layerHorizontalAlignment: "renderPDF",
      layerVerticalAlignment: "renderPDF",
      layerTextContentTemplate: "renderPDF",
      layerTextColor: "renderPDF",
      layerTextSize: "renderPDF",
    },

    methods: {
      renderPDF: debounce(function() {
        pdfRenderer.renderItemToPdf(this.game, this.component, this.item).then((pdf) => {
          this.pdfBlob = pdf
        })
      }, RENDER_DELAY_MS)
    }
  }

</script>

<style scoped>
  iframe {
    width: 100%;
    min-height: 400px;
  }
</style>
