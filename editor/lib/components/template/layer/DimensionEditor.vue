<template lang="pug">
fieldset.fieldset
  legend Dimensions

  p Expressed as percentage of total width or height.

  .grid-x.grid-padding-x
    .medium-12.large-6.cell
      .input-group
        span.input-group-label
          strong X%
        input.input-group-field(type="number" v-model.number="layerDimensionX")

    .medium-12.large-6.cell
      .input-group
        span.input-group-label
          strong Y%
        input.input-group-field(type="number" v-model.number="layerDimensionY")

  .grid-x.grid-padding-x
    .medium-12.large-6.cell
      .input-group
        span.input-group-label
          strong W%
        input.input-group-field(type="number" v-model.number="layerDimensionW")

    .medium-12.large-6.cell
      .input-group
        span.input-group-label
          strong H%
        input.input-group-field(type="number" v-model.number="layerDimensionH")
</template>

<script>
  import { debounce, isString } from 'lodash'
  import { mapGetters, mapActions } from 'vuex'

  const INPUT_DELAY_MS = 400

  export default {
    props: ["layer"],

    computed: {
      ...mapGetters(["getLayerDimensions"]),

      layerDimensions() { return this.getLayerDimensions(this.layer) },

      layerDimensionX: {
        get() { return this.layerDimensions.x },

        set(newX) {
          if(isString(newX) || newX < 0) { newX = 0 }
          this.updateDimensionSlowly({ ...this.layerDimensions, x: newX })
        }
      },

      layerDimensionY: {
        get() { return this.layerDimensions.y },

        set(newY) {
          if(isString(newY) || newY < 0) { newY = 0 }
          this.updateDimensionSlowly({ ...this.layerDimensions, y: newY })
        }
      },

      layerDimensionW: {
        get() { return this.layerDimensions.w },

        set(newW) {
          if(isString(newW) || newW < 0) { newW = 0 }
          this.updateDimensionSlowly({ ...this.layerDimensions, w: newW })
        }
      },

      layerDimensionH: {
        get() { return this.layerDimensions.h },

        set(newH) {
          if(isString(newH) || newH < 0) { newH = 0 }
          this.updateDimensionSlowly({ ...this.layerDimensions, h: newH })
        }
      },
    },

    methods: {
      ...mapActions(["updateDimension"]),

      updateDimensionSlowly: debounce(function(dimensions) {
        this.updateDimension(dimensions)
      }, INPUT_DELAY_MS),
    }
  }
</script>
