<template lang="pug">
  iframe(:src="pdfBlob")
</template>

<script>
  import { debounce, reduce } from 'lodash'
  import { mapGetters } from 'vuex'
  import pdfRenderer from './template_examples'

  const RENDER_DELAY_MS = 800

  export default {
    props: ["game", "component", "item"],

    mounted() { this.renderPDF() },

    data() {
      return {
        pdfBlob: null
      }
    },

    computed: {
      ...mapGetters(["activeDimensions"]),

      templateLayers() {
        return this.$store.getters.getTemplateLayers(this.component.template)
      }
    },

    watch: {
      // Props
      game: "renderPDF",
      component: "renderPDF",
      item: "renderPDF",
      // Computed
      activeDimensions: "renderPDF",
      templateLayers: "renderPDF",
    },

    methods: {
      renderPDF: debounce(function() {
        pdfRenderer.renderItemToPdf(this.game, this.component, this.item).then((pdf) => {
          this.pdfBlob = pdf
        })
      }, RENDER_DELAY_MS, { leading: true })
    }
  }

</script>

<style scoped>
  iframe {
    min-height: 400px;
  }
</style>
