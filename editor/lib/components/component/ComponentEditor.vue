<template lang="pug">
div
  h4 Editing: {{ component.title || "[component title not set]" }}
  hr

  .grid-x
    .small-4
      source-manager(:component="component")

    #transform-manager.small-4
      h5 Transform Manager
      hr

      p Transforms:
      table(v-if="source")
        thead
          th Name:
          th Type:
        tr(v-for="property in sourceProperties(source)")
          td Expose("{{ property }}")
          td Raw

    .small-4
      template-manager(:component="component")
</template>

<script>
  import { mapState, mapGetters, mapMutations, mapActions, } from 'vuex'
  import SourceManager from '../source/SourceManager.vue'
  import TemplateManager from '../template/TemplateManager.vue'

  export default {
    props: ["component"],

    computed: {
      ...mapGetters(["sourceProperties"]),
      source() { return this.component.source }
    },

    components: {
      'source-manager': SourceManager,
      'template-manager': TemplateManager
    }
  }
</script>
