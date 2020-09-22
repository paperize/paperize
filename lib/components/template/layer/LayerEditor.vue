<template lang="pug">
v-layout(column)
  v-flex
    text-layer-editor(v-if="layer.type == 'text'" :layer="layer" :source="source")
    image-layer-editor(v-else-if="layer.type == 'image'" :layer="layer" :source="source")
    shape-layer-editor(v-else-if="layer.type == 'shape'" :layer="layer" :source="source")
</template>

<script>
  import TextLayerEditor from './TextLayerEditor.vue'
  import ImageLayerEditor from './ImageLayerEditor.vue'
  import ShapeLayerEditor from './ShapeLayerEditor.vue'

  export default {
    props: ["layer", "source", "template"],

    components: {
      TextLayerEditor,
      ImageLayerEditor,
      ShapeLayerEditor,
    },
  }
</script>
