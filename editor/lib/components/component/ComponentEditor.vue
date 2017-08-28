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

    #template-manager.small-4
      h5 Template Manager
      hr

      div(v-if="source")
        p Item Previews:

        p(v-for="property in sourceProperties(source)") {{ property }}

        ul.menu.horizontal
          li
            a &lt;&lt;
          li Item xx / yy
          li
            a &gt;&gt;
</template>

<script>
  import { mapState, mapGetters, mapMutations, mapActions, } from 'vuex'
  import SourceManager from '../source/SourceManager.vue'

  export default {
    props: ["component"],

    computed: {
      ...mapGetters(["sourceProperties"]),
      source() { return this.component.source }
    },

    components: {
      'source-manager': SourceManager
    }
  }
</script>
