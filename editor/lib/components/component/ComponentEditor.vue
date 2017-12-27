<template lang="pug">
div
  .grid-x.grid-margin-x
    //- Source status
    .small-6.cell
      h4
        i.fa.fa-table
        |  Source

      template(v-if="component.source")
        table
          thead
            tr
              th
                | {{ component.source.name + " " }}
                a(@click="openSourceManager()")
                  i.fa.fa-pencil
          tbody
            tr(v-for="property in sourceProperties(component.source)")
              td.property-name(title="Property Name") {{ property }}

      template(v-else)
        p This component does not have a data Source set.
        .grid-x.grid-margin-x
          .medium-auto.cell
          .medium-6.cell
            a.button(@click="openSourceManager()") Set A Source...
          .medium-auto.cell

      modal(name="Source Manager" width="80%")
        source-manager(:component="component")

        button.close-button(aria-label="Close modal" type="button" @click="$modal.hide('Source Manager')")
          span(aria-hidden="true") &times;

    //- Template status
    .small-6.cell
      h4
        i.fa.fa-file-code-o
        |  Template

      template(v-if="component.template")
      template(v-else)
        p This component does not have a Template set.
        .grid-x.grid-margin-x
          .medium-auto.cell
          .medium-6.cell
            ul.menu.vertical
              li
                a.button(@click="openTemplateManager()") Load Template
              li
                a.button(@click="openTemplateManager()") Create Template
          .medium-auto.cell

      modal(name="Template Manager" width="80%")
        template-manager(:component="component")


        button.close-button(aria-label="Close modal" type="button" @click="$modal.hide('Template Manager')")
          span(aria-hidden="true") &times;
</template>

<script>
  import { mapGetters } from 'vuex'
  import SourceManager from '../source/SourceManager.vue'
  import TemplateManager from '../template/TemplateManager.vue'

  export default {
    props: ["component"],

    components: {
      'source-manager': SourceManager,
      'template-manager': TemplateManager
    },

    computed: mapGetters(["sourceProperties"]),

    methods: {
      openSourceManager() {
        this.$modal.show('Source Manager')
      },

      openTemplateManager() {
        this.$modal.show('Template Manager')
      },
    }
  }
</script>
