<template lang="pug">
v-card
  v-card-title
    .headline Template Editor
    v-spacer
    refresh-source-button(:spreadsheet="componentSource")
    v-btn(small fab color="red" @click="$emit('close-dialog')")
      v-icon close

  v-divider

  v-card-text
    v-container(ma-0 pa-0 grid-list-md fluid)
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
  import { mapGetters, mapActions } from 'vuex'

  import LayerManager from './layer/LayerManager.vue'
  import LayerEditor from './layer/LayerEditor.vue'
  import TemplateSizeEditor from './TemplateSizeEditor.vue'
  import TemplatePreviewer from './TemplatePreviewer.vue'
  import RefreshSourceButton from '../source/RefreshSourceButton.vue'

  export default {
    props: ["component"],

    components: {
      TemplatePreviewer,
      TemplateSizeEditor,
      LayerManager,
      LayerEditor,
      RefreshSourceButton,
    },

    data() {
      return {
        editingSize: false
      }
    },

    computed: {
      ...mapGetters([
        "activeGame",
        "activeLayer",
        "findComponentSheet",
        "findComponentTemplate"
      ]),

      componentSource() {
        return this.findComponentSheet(this.component)
      },

      componentTemplate() {
        return this.findComponentTemplate(this.component)
      },

      sizeLabel() {
        return `(${this.componentTemplate.size.w}in x ${this.componentTemplate.size.h}in)`
      }
    },
  }
</script>
