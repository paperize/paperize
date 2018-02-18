<template lang="pug">
.layer-editor
  .grid-x.grid-padding-x
    .small-12.cell
      .input-group
        span.input-group-label
          label(for="layer-name")
            strong Name
        input.input-group-field(id="layer-name" type="text" v-model="layerName")

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

  code-layer-editor(v-if="layer.type == 'code'" :layer="layer" :source="source")
  text-layer-editor(v-else-if="layer.type == 'text'" :layer="layer" :source="source")
  image-layer-editor(v-else-if="layer.type == 'image'" :layer="layer" :source="source")
  shape-layer-editor(v-else-if="layer.type == 'shape'" :layer="layer" :source="source")
</template>

<script>
  import { isString, debounce } from 'lodash'
  import { mapGetters, mapActions } from 'vuex'
  import CodeLayerEditor from './CodeLayerEditor.vue'
  import TextLayerEditor from './TextLayerEditor.vue'
  import ImageLayerEditor from './ImageLayerEditor.vue'
  import ShapeLayerEditor from './ShapeLayerEditor.vue'

  const INPUT_DELAY_MS = 400

  export default {
    props: ["layer", "source"],

    components: {
      "code-layer-editor": CodeLayerEditor,
      "text-layer-editor": TextLayerEditor,
      "image-layer-editor": ImageLayerEditor,
      "shape-layer-editor": ShapeLayerEditor,
    },

    computed: {
      ...mapGetters(["getLayerDimensions"]),

      layerDimensions() { return this.getLayerDimensions(this.layer) },

      layerName: {
        get() { return this.layer.name },

        set(name) {
          this.updateLayerSlowly({ ...this.layer, name: name })
        }
      },

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
      ...mapActions(["updateLayer", "updateDimension"]),

      updateLayerSlowly: debounce(function(args) {
        this.updateLayer(args)
      }, INPUT_DELAY_MS),

      updateDimensionSlowly: debounce(function(dimensions) {
        this.updateDimension(dimensions)
      }, INPUT_DELAY_MS),
    }
  }
</script>

<style>
  /* color inputs are ugly in XY grid with input groups if I don't puff them up a bit */
  input[type='color'] {
    height: 2.5em;
  }
</style>
