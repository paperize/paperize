<template lang="pug">
#source-manager
  .grid-x
    template(v-if="activeSource")
      .small-1.cell
        a.unset-source(@click="unsetComponentSource({ component })") &times;

      .small-10.cell
        h5.truncate "{{ activeSource.name }}"

      .small-1.cell
        a.refresh(@click="createOrUpdateSourceById(activeSource.id)")
          i.fa.fa-refresh

    template(v-else)
      .small-12
        h5.truncate Select a Source:

  template(v-if="component.source")
    table.source-properties
      thead
        tr
          th Properties
      tbody
        tr(v-for="property in sourceProperties(component.source)")
          td.property-name(title="Property Name") {{ property }}

  template(v-else)
    template(v-if="sources.length == 0")
      p You have no sources.
    template(v-else)
      ul
        li(v-for="source in sources")
          a.delete-source(@click="deleteSource({ source })") &times;
          a.select-source(@click="setComponentSource({ component, source })")  {{ source.name }}


    a.button(@click="$modal.show('source-paste-form')") Paste a Link
    source-paste-form

    a.button(@click="$modal.show('source-explorer')") Browse Google Sheets
    source-explorer
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions, } from 'vuex'
import SourcePasteForm from './SourcePasteForm.vue'
import SourceExplorer from './SourceExplorer.vue'

export default {
  props: ["component"],

  components: {
    'source-paste-form': SourcePasteForm,
    'source-explorer': SourceExplorer
  },

  computed: {
    ...mapGetters([
      "sources",
      "activeSource",
      "sourceProperties",
      "activeSourcePropertyExamples"
    ]),
  },

  methods: {
    ...mapMutations([
      "unsetComponentSource",
      "deleteSource"
    ]),

    ...mapActions([
      "setComponentSource",
      "createOrUpdateSourceById"
    ])
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

  .property-examples {
    font-size: 1em;
    font-style: italic;
  }
</style>
