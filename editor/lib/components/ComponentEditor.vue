<template lang="pug">
div
  h2 Editing: {{ component.title || "[component title not set]" }}
  .grid-x
    #source-manager.small-4
      h5 Source Manager

      p(v-if="sources.length == 0")
        | You have no sources.
      ul(v-else)
        li(v-for="source in sources") {{ source.name }}


      a.button(data-open="source-paste-form") Paste a Link

      source-paste-form

      a.button(data-open="source-explorer") Browse Google Sheets
      .reveal#source-explorer(data-reveal)
        h2 Browse Your Google Sheets

        p Loading your Sheets...

    #transform-manager.small-4
      h5 Transform Manager

    #template-manager.small-4
      h5 Template Manager
</template>

<script>
  import { mapState } from 'vuex'
  import SourcePasteForm from './SourcePasteForm.vue'

  export default {
    props: ["component"],

    computed: { ...mapState(["sources"]) },

    components: {
      'source-paste-form': SourcePasteForm
    }
  }
</script>
