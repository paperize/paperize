<template lang="pug">
v-card
  v-card-title
    .headline Renderer Comparator

  v-card-text
    v-layout
      v-flex(sm6)
        template-previewer(:game="activeGame" :component="activeComponent")

      v-flex(sm6)
        v-btn-toggle(v-model="exportFormat" style="margin-bottom: 38px;")
          v-btn(value="pdf") .PDF
          v-btn(value="jpg") .JPG
          v-btn(value="png") .PNG
          v-btn(value="svg") .SVG

        template-renderer(:exportFormat="exportFormat" :game="activeGame" :component="activeComponent" :item="activeItem")

</template>

<script>
import { mapGetters } from 'vuex'
import TemplateRenderer from './TemplateRenderer.vue'
import TemplatePreviewer from './TemplatePreviewer.vue'

export default {
  props: ["component"],

  components: { TemplatePreviewer, TemplateRenderer },

  data() {
    return {
      exportFormat: 'svg'
    }
  },

  computed: {
    ...mapGetters([
      "activeGame",
      "activeComponent",
      "activeItem",
    ])
  }
}
</script>
