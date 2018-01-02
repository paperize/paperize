<template lang="pug">
div
  .grid-x.grid-margin-x
    //- Source status
    .small-6.cell
      h4
        i.fas.fa-table
        |  Source

      template(v-if="component.source")
        table
          thead
            tr
              th
                | {{ component.source.name + " " }}
                a(@click="openSourceManager()")
                  i.fas.fa-pencil-alt
          tbody
            tr(v-for="property in sourceProperties(component.source)")
              td.property-name(title="Property Name") {{ property }}

      template(v-else)
        p
          strong This component does not have a data Source set.

        .grid-x.grid-margin-x
          .medium-auto.cell
          .medium-6.cell
            a.button(@click="openSourceManager()") Set a Source...
          .medium-auto.cell

      modal(name="Source Manager" width="80%")
        source-manager(:component="component")

        button.close-button(aria-label="Close modal" type="button" @click="$modal.hide('Source Manager')")
          span(aria-hidden="true") &times;

    //- Template status
    .small-6.cell
      h4
        i.fas.fa-file-code
        |  Template

      template(v-if="component.template")
        .grid-x
          .auto.cell
          .shrink.cell
            a.button(@click="openTemplateManager()")
              i.fas.fa-pencil-alt
              |  Edit
          .auto.cell
        .grid-x
          .auto.cell
          .shrink.cell
            template-previewer.inline-preview(v-if="!editingTemplate" :game="activeGame" :component="activeComponent")
          .auto.cell

      template(v-else)
        p
          strong This component does not have a Template set.

        template(v-if="component.source")
          .grid-x.grid-margin-x
            .medium-auto.cell
            .medium-6.cell
              a.button(@click="openTemplateManager()") Set a Template...
            .medium-auto.cell

        template(v-else)
          p
            i.fas.fa-arrow-left
            em  You need to set a data Source before you can get started with Templates.

      modal(name="Template Manager" height="auto" width="98%" :pivotY=".15" :scrollable="true")
        template-manager(:component="component")

        button.close-button(aria-label="Close modal" type="button" @click="closeTemplateManager")
          span(aria-hidden="true") &times;
</template>

<script>
  import { mapGetters } from 'vuex'
  import SourceManager from '../source/SourceManager.vue'
  import TemplateManager from '../template/TemplateManager.vue'
  import TemplatePreviewer from '../template/TemplatePreviewer.vue'

  export default {
    props: ["component"],

    components: {
      'source-manager': SourceManager,
      'template-manager': TemplateManager,
      'template-previewer': TemplatePreviewer
    },

    data() {
      return {
        // TODO: fix this required preview-hiding behavior due to multiple previewers
        editingTemplate: false
      }
    },

    computed: {
      ...mapGetters(["activeGame", "activeComponent", "sourceProperties"]),
    },

    methods: {
      openSourceManager() {
        this.$modal.show('Source Manager')
      },

      openTemplateManager() {
        this.$modal.show('Template Manager')
        this.editingTemplate = true
      },

      closeTemplateManager() {
        this.$modal.hide('Template Manager')
        this.editingTemplate = false
      }
    }
  }
</script>
