<template lang="pug">
  iframe(:src="pdfBlob")
</template>

<script>
  import { debounce, reduce } from 'lodash'
  import { mapGetters } from 'vuex'
  import pdfRenderer from './template_examples'

  const RENDER_DELAY_MS = 800

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

      layerStrokePresent() { return this.activeLayer.strokePresent },
      layerStrokeWidth() { return this.activeLayer.strokeWidth },
      layerStrokeColor() { return this.activeLayer.strokeColor },
      layerFillPresent() { return this.activeLayer.fillPresent },
      layerFillColor() { return this.activeLayer.fillColor },

      layerImageNameStatic() { return this.activeLayer.imageNameStatic },
      layerImageName() { return this.activeLayer.imageName },
      layerImageNamePrefix() { return this.activeLayer.imageNamePrefix },
      layerImageNameProperty() { return this.activeLayer.imageNameProperty },
      layerImageNameSuffix() { return this.activeLayer.imageNameSuffix },
      layerHorizontalAlignment() { return this.activeLayer.horizontalAlignment },
      layerVerticalAlignment() { return this.activeLayer.verticalAlignment },

      layerTextContentTemplate() { return this.activeLayer.textContentTemplate },
      layerTextColor() { return this.activeLayer.textColor },
      layerTextSize() { return this.activeLayer.textSize },

      templateLayers() {
        return this.$store.getters.getTemplateLayers(this.component.template)
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
      }, RENDER_DELAY_MS, { leading: true })
    }
  }

</script>

<style scoped>
  iframe {
    min-height: 400px;
  }
</style>
