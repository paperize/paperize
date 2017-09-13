<template lang="pug">
#source-manager
  .grid-x(v-if="activeSource")
    .small-1.cell
      a.unset-source(@click="unsetComponentSource({ component })") &times;

    .small-9.cell
      h5.truncate "{{ activeSource.name }}"

    .small-2.cell
      a(@click="createOrUpdateSourceById(activeSource.id)") refresh

  .grid-x(v-else)
    .small-12
      h5.truncate Select a Source:

  div(v-if="component.source")
    table.source-properties(v-if="component.source")
      thead
        th Property Name
      tr(v-for="property in sourceProperties(component.source)")
        td.property-name(title="Property Name") {{ property }}


  div(v-else)
    p(v-if="sources.length == 0")
      | You have no sources.
    div(v-else)
      ul
        li(v-for="source in sources")
          a.delete-source(@click="deleteSource({ source })") &times;
          a.select-source(@click="setComponentSource({ component, source })")  {{ source.name }}


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
    ...mapGetters(["sources", "activeSource", "sourceProperties", "activeSourcePropertyExamples"]),
  },

  methods: {
    ...mapMutations(["unsetComponentSource", "deleteSource"]),
    ...mapActions(["setComponentSource", "createOrUpdateSourceById"])
  },

  components: {
    'source-paste-form': SourcePasteForm,
    'source-explorer': SourceExplorer
  }
}
</script>

<style scoped>
  .unset-source {
    font-weight: bold;
  }

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
