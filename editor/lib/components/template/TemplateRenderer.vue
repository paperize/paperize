<template lang="pug">
  iframe(:src="pdfBlob")
</template>

<script>
  import { debounce } from 'lodash'
  import { mapGetters } from 'vuex'
  import pdfRenderer from './template_examples'

  const RENDER_DELAY_MS = 800

  export default {
    props: ["game", "component", "item"],

    data() {
      return {
        pdfBlob: null
      }
    },

    computed: mapGetters(["activeDimensions"]),

    watch: {
      activeDimensions() {
        this.renderPDF()
      }
    },

    methods: {
      renderPDF: debounce(function() {
        pdfRenderer.renderItemToPdf(this.game, this.component, this.item).then((pdf) => {
          this.pdfBlob = pdf
        })
      }, RENDER_DELAY_MS)
    }
  }

</script>

<style scoped>
  iframe {
    min-height: 400px;
  }
</style>
