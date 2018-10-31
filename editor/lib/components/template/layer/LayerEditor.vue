<template lang="pug">
v-layout(column)
  v-flex
    v-text-field(v-model="layerName" label="Name")

  v-flex
    dimension-editor(:layer="layer" :size="template.size")

  v-flex
    code-layer-editor(v-if="layer.type == 'code'" :layer="layer" :source="source")
    text-layer-editor(v-else-if="layer.type == 'text'" :layer="layer" :source="source")
    image-layer-editor(v-else-if="layer.type == 'image'" :layer="layer" :source="source")
    shape-layer-editor(v-else-if="layer.type == 'shape'" :layer="layer" :source="source")
</template>

<script>
  import { debounce } from 'lodash'
  import { mapActions } from 'vuex'
  import DimensionEditor from './DimensionEditor.vue'
  import CodeLayerEditor from './CodeLayerEditor.vue'
  import TextLayerEditor from './TextLayerEditor.vue'
  import ImageLayerEditor from './ImageLayerEditor.vue'
  import ShapeLayerEditor from './ShapeLayerEditor.vue'

  const INPUT_DELAY_MS = 400

  export default {
    props: ["layer", "source", "template"],

    components: {
      DimensionEditor,
      CodeLayerEditor,
      TextLayerEditor,
      ImageLayerEditor,
      ShapeLayerEditor,
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
