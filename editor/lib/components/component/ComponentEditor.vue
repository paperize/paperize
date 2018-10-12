<template lang="pug">
div
  v-layout(row)
    //- Source status
    source-panel(:component="component")

    //- Template status
    template-panel(:component="component")
</template>

<script>
  import SourcePanel from '../source/SourcePanel.vue'
  import TemplatePanel from '../template/TemplatePanel.vue'

  export default {
    props: ["component"],

    components: {
      'source-panel': SourcePanel,
      'template-panel': TemplatePanel
    },
  }
</script>
