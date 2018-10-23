<template lang="pug">
v-flex#template-editor(sm8 md6)
  .headline Template

  template(v-if="componentTemplate")
    v-btn(fab small @click="showTemplateManager = true")
      v-icon edit

    template-previewer.inline-preview(v-if="!showTemplateManager" :game="activeGame" :component="activeComponent")

  template(v-else)
    p
      strong This component does not have a Template set.

    template(v-if="componentSource")
      v-btn(small color="primary" @click="showTemplateManager = true") Set a Template...

    template(v-else)
      p
        em You need to set a data Source before you can get started with Templates.

  v-dialog(v-model="showTemplateManager" fullscreen lazy)
    template-manager(:component="component" @close-dialog="showTemplateManager = false")
</template>

<script>
  import { mapGetters } from 'vuex'
  import TemplateManager from './TemplateManager.vue'
  import TemplatePreviewer from './TemplatePreviewer.vue'

  export default {
    props: ["component"],

    components: {
      'template-manager': TemplateManager,
      'template-previewer': TemplatePreviewer,
    },

    data() {
      return {
        showTemplateManager: false
      }
    },

    computed: {
      ...mapGetters([
        "activeGame",
        "activeComponent",
        "findComponentSource",
        "findComponentTemplate"
      ]),

      componentSource() { return this.findComponentSource(this.component) },

      componentTemplate() { return this.findComponentTemplate(this.component) }
    }
  }
</script>
