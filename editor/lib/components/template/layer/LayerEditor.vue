<template lang="pug">
v-layout(column)
  v-flex
    code-layer-editor(v-if="layer.type == 'code'" :layer="layer" :source="source")
    text-layer-editor(v-else-if="layer.type == 'text'" :layer="layer" :source="source")
    image-layer-editor(v-else-if="layer.type == 'image'" :layer="layer" :source="source")
    shape-layer-editor(v-else-if="layer.type == 'shape'" :layer="layer" :source="source")
</template>

<script>
  import { debounce } from 'lodash'
  import { mapActions } from 'vuex'
  import CodeLayerEditor from './CodeLayerEditor.vue'
  import TextLayerEditor from './TextLayerEditor.vue'
  import ImageLayerEditor from './ImageLayerEditor.vue'
  import ShapeLayerEditor from './ShapeLayerEditor.vue'

  export default {
    props: ["layer", "source", "template"],

    components: {
      CodeLayerEditor,
      TextLayerEditor,
      ImageLayerEditor,
      ShapeLayerEditor,
    },
  }
</script>
