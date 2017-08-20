<template lang="pug">
div
  h2 Editing: {{ component.title || "[component title not set]" }}
  .grid-x
    #source-manager.small-4
      h5 Source Manager

      p You have no sources.

      a.button(data-open="source-paste-form") Paste a Link

      source-paste-form

      a.button(data-open="source-explorer") Browse Google Sheets
      .reveal#source-explorer(data-reveal)
        h2 Browse Your Google Sheets

        //- p Paste a Google Sheets link or ID here:

    #transform-manager.small-4
      h5 Transform Manager

    #template-manager.small-4
      h5 Template Manager
</template>

<script>
  import FoundationMixin from '../mixins/foundation'
  import SourcePasteForm from './SourcePasteForm.vue'

  export default {
    mixins: [FoundationMixin],
    props: ["component"],
    components: {
      'source-paste-form': SourcePasteForm
    }
  }
</script>
