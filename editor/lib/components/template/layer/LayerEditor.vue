<template lang="pug">
.layer-editor
  .grid-x.grid-padding-x
    .small-12.cell
      .input-group
        span.input-group-label
          label(for="layer-name")
            strong Name
        input.input-group-field(id="layer-name" type="text" v-model="layerName")

  dimension-editor(:layer="layer")

  code-layer-editor(v-if="layer.type == 'code'" :layer="layer" :source="source")
  text-layer-editor(v-else-if="layer.type == 'text'" :layer="layer" :source="source")
  image-layer-editor(v-else-if="layer.type == 'image'" :layer="layer" :source="source")
  shape-layer-editor(v-else-if="layer.type == 'shape'" :layer="layer" :source="source")
</template>

<script>
  import { isString, debounce } from 'lodash'
  import { mapGetters, mapActions } from 'vuex'
  import DimensionEditor from './DimensionEditor.vue'
  import CodeLayerEditor from './CodeLayerEditor.vue'
  import TextLayerEditor from './TextLayerEditor.vue'
  import ImageLayerEditor from './ImageLayerEditor.vue'
  import ShapeLayerEditor from './ShapeLayerEditor.vue'

  const INPUT_DELAY_MS = 400

  export default {
    props: ["layer", "source"],

    components: {
      "dimension-editor": DimensionEditor,
      "code-layer-editor": CodeLayerEditor,
      "text-layer-editor": TextLayerEditor,
      "image-layer-editor": ImageLayerEditor,
      "shape-layer-editor": ShapeLayerEditor,
    },

    computed: {
      layerName: {
        get() { return this.layer.name },

        set(name) {
          this.updateLayerSlowly({ ...this.layer, name: name })
        }
      },
    },

    methods: {
      ...mapActions(["updateLayer"]),

      updateLayerSlowly: debounce(function(args) {
        this.updateLayer(args)
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
