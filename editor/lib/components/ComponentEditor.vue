<template lang="pug">
div
  h2 Editing: {{ component.title || "[component title not set]" }}
  hr

  .grid-x
    #source-manager.small-4
      h5 Source Manager
      hr

      div(v-if="activeSource")
        p Source: {{ activeSource.name }}

        p Properties:

        ul
          li(v-for="property in activeSource.properties")
            strong {{ property }}

            p Examples: {{ propertyExamples(property) }}

      div(v-else)
        p(v-if="sources.length == 0")
          | You have no sources.
        ul(v-else)
          li(v-for="source in sources")
            a(@click="setActiveSource({ source })") {{ source.name }}


        a.button(data-open="source-paste-form") Paste a Link

        source-paste-form

        a.button(data-open="source-explorer") Browse Google Sheets
        .reveal#source-explorer(data-reveal)
          h2 Browse Your Google Sheets

          p Loading your Sheets...

    #transform-manager.small-4
      h5 Transform Manager
      hr

    #template-manager.small-4
      h5 Template Manager
      hr
</template>

<script>
  import { chain } from 'lodash'
  import { mapMutations, mapState } from 'vuex'
  import SourcePasteForm from './SourcePasteForm.vue'

  export default {
    props: ["component"],

    computed: { ...mapState(["sources", "activeSource"]) },

    methods: {
      ...mapMutations(["setActiveSource"]),

      propertyExamples(property) {
        // get lodash rowdy
        return chain(this.$store.state.activeSource.items)
          .slice(0, 3)
          .map(property)
        .value()

      }
    },

    components: {
      'source-paste-form': SourcePasteForm
    }
  }
</script>
