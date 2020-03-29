<template lang="pug">
  template-renderer(:renderer="renderPDF" :game="game" :component="component" :item="item")
    //- iframe(:src="pdfBlob") eliminate warnings in chrome
    //- embed(:src="pdfBlob" width="100%" height="100%" name="plugin" id="plugin" type="application/pdf")
    object(:data="pdfBlob" type="application/pdf")
</template>

<script>
  import { debounce } from 'lodash'
  import { mapGetters } from 'vuex'
  import TemplateRenderer from './TemplateRenderer.vue'
  import pdfRenderer from '../../services/pdf_renderer'

  const RENDER_DELAY_MS = 600

  export default {
    props: {
      game: {
        required: true
      },
      component: {
        required: true
      },
      item: {
        required: true
      },
    },

    components: { TemplateRenderer },

    data() {
      return {
        pdfBlob: null
      }
    },

    computed: {
      ...mapGetters(["findComponentTemplate"]),

      template() {
        return this.findComponentTemplate(this.component)
      }
    },

    methods: {
      renderPDF: debounce(function() {
        pdfRenderer.renderItemToPdf(this.game, this.component, this.item, this.template).then((pdf) => {
          this.pdfBlob = pdf
        })
      }, RENDER_DELAY_MS)
    }
  }

</script>

<style scoped>
  iframe, object, embed {
    width: 100%;
    min-height: 400px;
  }
</style>
