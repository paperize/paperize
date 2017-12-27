<template lang="pug">
.grid-x.grid-padding-x
  .small-12.cell
    h4 Template Editor
    hr

  .small-4.cell
    h5 Component Size
    template-size-editor(:template="component.template")

    h5 Layers
    layer-manager(:template="component.template")

  .small-4.cell
    h5 Layer Config

  .small-4.cell
    h5 Preview

    template-previewer.inline-preview(:game="activeGame" :component="component")
</template>

<script>
  import { mapGetters } from 'vuex'

  import LayerManager from './layer/LayerManager.vue'
  import TemplateSizeEditor from './TemplateSizeEditor.vue'
  import TemplatePreviewer from './TemplatePreviewer.vue'

  export default {
    props: ["component"],

    components: {
      "template-previewer": TemplatePreviewer,
      "template-size-editor": TemplateSizeEditor,
      "layer-manager": LayerManager
    },

    data() {
      return { }
    },

    computed: mapGetters(["activeGame"]),

    methods: { }
  }
</script>
