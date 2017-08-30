<template lang="pug">
#source-manager
  h5(v-if="activeSource")
    | Source: {{ activeSource.name }}
    a.small(@click="unsetSource({ component })")  edit
  h5(v-else) Select a Source:
  hr

  div(v-if="component.source")
    table.source-properties(v-if="component.source")
      thead
        th Property Name:
      tr(v-for="property in sourceProperties(component.source)")
        td.property-name(title="Property Name") {{ property }}


  div(v-else)
    p(v-if="sources.length == 0")
      | You have no sources.
    div(v-else)
      ul
        li(v-for="source in sources")
          a(@click="setComponentSource({ component, source })") {{ source.name }}


    a.button(data-open="source-paste-form") Paste a Link
    source-paste-form

    a.button(data-open="source-explorer") Browse Google Sheets
    source-explorer
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions, } from 'vuex'
import SourcePasteForm from './SourcePasteForm.vue'
import SourceExplorer from './SourceExplorer.vue'

export default {
  props: ["component"],

  computed: {
    ...mapState(["sources"]),
    ...mapGetters(["activeSource", "sourceProperties", "activeSourcePropertyExamples"]),
  },

  methods: {
    ...mapActions(["setComponentSource"]),
    ...mapMutations(["unsetSource"])
  },

  components: {
    'source-paste-form': SourcePasteForm,
    'source-explorer': SourceExplorer
  }
}
</script>

<style scoped>
  .source-properties li {
    border-bottom: 2px solid gray;
  }

  .property-name {
    font-size: 1em;
    font-weight: bold;
  }

  .property-examples {
    font-size: 1em;
    font-style: italic;
  }
</style>
