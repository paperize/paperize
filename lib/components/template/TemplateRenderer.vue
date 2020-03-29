<template lang="pug">
  div
    slot
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    props: {
      game: {
        required: true
      },
      component: {
        required: true
      },
      item: {
        required: true
      },
      renderer: {
        required: true
      }
    },

    mounted() { this.renderTemplate() },

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
      game: "renderTemplate",
      component: "renderTemplate",
      item: "renderTemplate",
      // Computed
      activeDimensions: "renderTemplate",
      templateLayers: "renderTemplate",
      activeLayer: "renderTemplate",
      layerStrokePresent: "renderTemplate",
      layerStrokeWidth: "renderTemplate",
      layerStrokeColor: "renderTemplate",
      layerFillPresent: "renderTemplate",
      layerFillColor: "renderTemplate",
      layerImageNameStatic: "renderTemplate",
      layerImageName: "renderTemplate",
      layerImageNamePrefix: "renderTemplate",
      layerVisible: "renderTemplate",
      layerImageNameProperty: "renderTemplate",
      layerImageNameSuffix: "renderTemplate",
      layerImageScaling: "renderTemplate",
      layerHorizontalAlignment: "renderTemplate",
      layerVerticalAlignment: "renderTemplate",
      layerTextContentTemplate: "renderTemplate",
      layerTextColor: "renderTemplate",
      layerTextSize: "renderTemplate",
      layerHighlighting: "renderTemplate",
      allFonts: "renderTemplate"
    },

    methods: {
      renderTemplate() {
        this.renderer()
      }
    }
  }

</script>
