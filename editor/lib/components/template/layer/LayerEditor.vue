<template lang="pug">
.layer-editor
  .grid-x.grid-padding-x
    .shrink.cell
      label.text-right.middle(for="layer-name")
        strong Layer Name:
    .auto.cell
      input(id="layer-name" type="text" v-model="layerName")

  fieldset.fieldset
    legend Dimensions

    .grid-x.grid-padding-x
      .auto.cell
        .input-group
          span.input-group-label X
          input.input-group-field(type="number" v-model.number="layerDimensionX")

      .auto.cell
        .input-group
          span.input-group-label Y
          input.input-group-field(type="number" v-model.number="layerDimensionY")

    .grid-x.grid-padding-x
      .auto.cell
        .input-group
          span.input-group-label W
          input.input-group-field(type="number" v-model.number="layerDimensionW")

      .auto.cell
        .input-group
          span.input-group-label H
          input.input-group-field(type="number" v-model.number="layerDimensionH")

  code-layer-editor(v-if="layer.type == 'code'" :layer="layer")
  text-layer-editor(v-else-if="layer.type == 'text'" :layer="layer")
  image-layer-editor(v-else-if="layer.type == 'image'" :layer="layer")
  shape-layer-editor(v-else-if="layer.type == 'shape'" :layer="layer")
</template>

<script>
  import { isString, debounce } from 'lodash'
  import { mapGetters, mapActions } from 'vuex'
  import CodeLayerEditor from './CodeLayerEditor.vue'
  import TextLayerEditor from './TextLayerEditor.vue'
  import ImageLayerEditor from './ImageLayerEditor.vue'
  import ShapeLayerEditor from './ShapeLayerEditor.vue'

  const INPUT_DELAY_MS = 200

  export default {
    props: ["layer"],

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

        set(newName) {
          this.setLayerName({ layer: this.layer, name: newName })
        }
      },

      layerDimensionX: {
        get() { return this.layerDimensions.x },

        set(newX) {
          if(isString(newX) || newX < 0) { newX = 0 }
          this.setDimensionsSlowly({ ...this.layerDimensions, x: newX })
        }
      },

      layerDimensionY: {
        get() { return this.layerDimensions.y },

        set(newY) {
          if(isString(newY) || newY < 0) { newY = 0 }
          this.setDimensionsSlowly({ ...this.layerDimensions, y: newY })
        }
      },

      layerDimensionW: {
        get() { return this.layerDimensions.w },

        set(newW) {
          if(isString(newW) || newW < 0) { newW = 0 }
          this.setDimensionsSlowly({ ...this.layerDimensions, w: newW })
        }
      },

      layerDimensionH: {
        get() { return this.layerDimensions.h },

        set(newH) {
          if(isString(newH) || newH < 0) { newH = 0 }
          this.setDimensionsSlowly({ ...this.layerDimensions, h: newH })
        }
      },
    },

    methods: {
      ...mapActions(["setLayerName", "setLayerDimensions", "setDimensions"]),

      setDimensionsSlowly: debounce(function(dimensions) {
        this.setDimensions(dimensions)
      }, INPUT_DELAY_MS)
    }
  }
</script>
