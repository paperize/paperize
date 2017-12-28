<template lang="pug">
  code-layer-editor(v-if="layer.type == 'code'" :layer="layer")
  text-layer-editor(v-else-if="layer.type == 'text'" :layer="layer")
  image-layer-editor(v-else-if="layer.type == 'image'" :layer="layer")
  shape-layer-editor(v-else-if="layer.type == 'shape'" :layer="layer")
</template>

<script>
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
    }
  }
</script>
