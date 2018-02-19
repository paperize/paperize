<template lang="pug">
.grid-x.grid-padding-x
  .small-12.cell
    h4 Template Editor
    hr

  .small-4.cell
    template(v-if="editingSize")
      h5
        a(@click="editingSize = false")
          i.fas.fa-pencil-alt
        |  Component Size
      template-size-editor(:template="componentTemplate")

    h5(v-else)
      a(@click="editingSize = true")
        i.fas.fa-pencil-alt
      |  Component Size {{ sizeLabel }}

    hr

    layer-manager(:template="componentTemplate")

  .small-4.cell
    h5 Layer Config

    template(v-if="activeLayer")
      layer-editor(:layer="activeLayer" :source="componentSource")
    template(v-else)
      p No Layer Selected

  .small-4.cell
    h5 Preview

    template-previewer.inline-preview(:game="activeGame" :component="component")
</template>

<script>
  import { mapGetters } from 'vuex'

  import LayerManager from './layer/LayerManager.vue'
  import LayerEditor from './layer/LayerEditor.vue'
  import TemplateSizeEditor from './TemplateSizeEditor.vue'
  import TemplatePreviewer from './TemplatePreviewer.vue'

  export default {
    props: ["component"],

    components: {
      "template-previewer": TemplatePreviewer,
      "template-size-editor": TemplateSizeEditor,
      "layer-manager": LayerManager,
      "layer-editor": LayerEditor
    },

    data() {
      return {
        editingSize: false
      }
    },

    computed: {
      ...mapGetters(["activeGame", "activeLayer", "findComponentSource", "findComponentTemplate"]),

      componentSource() {
        return this.findComponentSource(this.component)
      },

      componentTemplate() {
        return this.findComponentTemplate(this.component)
      },

      sizeLabel() {
        return `(${this.componentTemplate.size.w}in x ${this.componentTemplate.size.h}in)`
      }
    },

    methods: { }
  }
</script>
