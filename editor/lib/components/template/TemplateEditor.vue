<template lang="pug">
v-card
  v-card-title
    .headline Template Editor
    v-spacer
    v-btn(small fab color="red" @click="$emit('close-dialog')")
      v-icon close

  v-divider

  v-card-text
    v-layout(row)
      v-flex(xs4)
        .subheading(v-if="editingSize")
          a(@click="editingSize = false")
            i.fas.fa-pencil-alt
          |  Component Size

          template-size-editor(:template="componentTemplate")

        .subheading(v-else)
          a(@click="editingSize = true")
            i.fas.fa-pencil-alt
          |  Component Size {{ sizeLabel }}

        layer-manager(:template="componentTemplate")

      v-flex(xs4)
        .subheading Layer Config

        template(v-if="activeLayer")
          layer-editor(:layer="activeLayer" :source="componentSource" :template="componentTemplate")
        template(v-else)
          p Create or select a layer

      v-flex(xs4)
        .subheading Preview

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

    components: { TemplatePreviewer, TemplateSizeEditor, LayerManager, LayerEditor },

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
