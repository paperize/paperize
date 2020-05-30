<template lang="pug">
v-card
  v-card-title
    .headline Template Editor
    v-spacer
    refresh-source-button(:spreadsheet="componentSource")
    v-btn(small fab color="red" @click="$emit('close-dialog')")
      v-icon close

  v-card-text(v-if="shouldShowNewTemplateSelection")
    v-container(ma-0 pa-0 grid-list-md fluid)
      v-layout(row)
        v-flex(xs4)
          v-radio-group(v-model="newTemplateSelection")
            v-tooltip(top)
              span(slot="activator")
                v-radio(label="New Template" value="NEW_TEMPLATE")
              span Create a new template
            v-tooltip(top)
              span(slot="activator")
                v-radio(label="Copy Template" value="COPY_TEMPLATE")
              span Copy pre-existing template from component
          v-select(box v-if="newTemplateSelection == 'COPY_TEMPLATE'" label="Component" v-model="componentId" :items="componentOptions" item-value="id" item-text="title")

  v-card-text(v-else)
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
        editingSize: false,
        newTemplateSelection: null,
      }
    },

    computed: {
      ...mapGetters([
        "activeGame",
        "activeLayer",
        "findComponent",
        "findComponentSheet",
        "findComponentTemplate",
        "allComponents",
      ]),

      componentId: {
        get() { null },
        set(componentId) {
          let existingComponent = this.findComponent(componentId)
          let template = this.findComponentTemplate(existingComponent)
          this.copyComponentTemplate({ component: this.component, template: template })
          }
      },
      componentOptions() {
        return this.allComponents.filter(component => component.id != this.component.id
        && this.findComponentTemplate(component).layerIds.length > 0)
      },

      componentSource() {
        return this.findComponentSheet(this.component)
      },

      componentTemplate() {
        return this.findComponentTemplate(this.component)
      },

      shouldShowNewTemplateSelection() {
        return this.findComponentTemplate(this.component).layerIds.length === 0
        && this.newTemplateSelection !== "NEW_TEMPLATE"
      },

      sizeLabel() {
        return `(${this.componentTemplate.size.w}in x ${this.componentTemplate.size.h}in)`
      }
    },
    methods: {

      ...mapActions([
        "copyComponentTemplate",
      ]),
    },
  }
</script>
