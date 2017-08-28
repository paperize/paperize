<template lang="pug">
#source-manager
  h5 Source Manager
  hr

  div(v-if="activeSource")
    a(@click="unsetSource({ component })") Change source
    p Source: {{ activeSource.name }}

    p Properties:

    ul
      li(v-for="property in activeSourceProperties")
        strong {{ property }}

        p
          | e.g.:
          em  {{ activeSourcePropertyExamples(property) }}

  div(v-else)
    p(v-if="sources.length == 0")
      | You have no sources.
    div(v-else)
      p Select a Source:
      ul
        li(v-for="source in sources")
          a(@click="setComponentSource({ component, source })") {{ source.name }}


    a.button(data-open="source-paste-form") Paste a Link

    source-paste-form

    a.button(data-open="source-explorer") Browse Google Sheets
    .reveal#source-explorer(data-reveal)
      h2 Browse Your Google Sheets

      p Loading your Sheets...
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions, } from 'vuex'
import SourcePasteForm from './SourcePasteForm.vue'

export default {
  props: ["component"],

  computed: {
    ...mapState(["sources"]),
    ...mapGetters(["activeSource", "activeSourceProperties", "activeSourcePropertyExamples"]),
  },

  methods: {
    ...mapActions(["setComponentSource"]),
    ...mapMutations(["unsetSource"])
  },

  components: {
    'source-paste-form': SourcePasteForm
  }
}
</script>
