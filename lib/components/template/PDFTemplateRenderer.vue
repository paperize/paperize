<template lang="pug">
  template-renderer(:renderer="renderPDF" :template="template" :item="item")
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
      template: { required: true },
      item: { required: true },
    },

    components: { TemplateRenderer },

    data() {
      return {
        pdfBlob: null
      }
    },

    computed: mapGetters(["projectItemThroughTemplate"]),

    methods: {
      renderPDF: debounce(function() {
        // all store fetching, input validation, magic transformation, and data aggregation
        return this.projectItemThroughTemplate(this.item, this.template)

          // all rendering
          .then((item) => {
            item.location = {
              page: 1,
              pageSize: item.size,
              x: 0,
              y: 0,
              ...item.size,
            }

            this.pdfBlob = pdfRenderer.renderItemToPdf(item)
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
