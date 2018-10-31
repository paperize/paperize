<template lang="pug">
v-layout(row)
  source-panel(:component="component")
  template-panel(:component="component")
</template>

<script>
  import SourcePanel from '../source/SourcePanel.vue'
  import TemplatePanel from '../template/TemplatePanel.vue'

  export default {
    props: ["component"],

    components: { SourcePanel, TemplatePanel },
  }
</script>
