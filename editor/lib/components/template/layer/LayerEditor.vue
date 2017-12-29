<template lang="pug">
.layer-editor
  .grid-x.grid-padding-x
    .shrink.cell
      label.text-right.middle(for="layer-name")
        strong Layer Name:
    .auto.cell
      input(id="layer-name" type="text" v-model="layerName")

  fieldset.fieldset
    legend Dimensions {{ layer.dimensions.mode }}

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
  import { isString } from 'lodash'
  import { mapActions } from 'vuex'
  import CodeLayerEditor from './CodeLayerEditor.vue'
  import TextLayerEditor from './TextLayerEditor.vue'
  import ImageLayerEditor from './ImageLayerEditor.vue'
  import ShapeLayerEditor from './ShapeLayerEditor.vue'

  export default {
    props: ["layer"],

    components: {
      "code-layer-editor": CodeLayerEditor,
      "text-layer-editor": TextLayerEditor,
      "image-layer-editor": ImageLayerEditor,
      "shape-layer-editor": ShapeLayerEditor,
    },

    computed: {
      layerName: {
        get() { return this.layer.name },

        set(newName) {
          this.setLayerName({ layer: this.layer, name: newName })
        }
      },

      layerDimensionX: {
        get() { return this.layer.dimensions.x },

        set(newX) {
          if(isString(newX) || newX < 0) { newX = 0 }
          const newDimensions = { ...this.layer.dimensions, x: newX }
          this.setLayerDimensions({ layer: this.layer, dimensions: newDimensions })
        }
      },

      layerDimensionY: {
        get() { return this.layer.dimensions.y },

        set(newY) {
          if(isString(newY) || newY < 0) { newY = 0 }
          const newDimensions = { ...this.layer.dimensions, y: newY }
          this.setLayerDimensions({ layer: this.layer, dimensions: newDimensions })
        }
      },

      layerDimensionW: {
        get() { return this.layer.dimensions.w },

        set(newW) {
          if(isString(newW) || newW < 0) { newW = 0 }
          const newDimensions = { ...this.layer.dimensions, w: newW }
          this.setLayerDimensions({ layer: this.layer, dimensions: newDimensions })
        }
      },

      layerDimensionH: {
        get() { return this.layer.dimensions.h },

        set(newH) {
          if(isString(newH) || newH < 0) { newH = 0 }
          const newDimensions = { ...this.layer.dimensions, H: newH }
          this.setLayerDimensions({ layer: this.layer, dimensions: newDimensions })
        }
      },
    },

    methods: mapActions(["setLayerName", "setLayerDimensions"])
  }
</script>
