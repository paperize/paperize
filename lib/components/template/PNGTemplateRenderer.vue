<template lang="pug">
  template-renderer(:renderer="renderPNG" :template="template" :item="item")
    #template-container
</template>

<script>
  import { debounce } from 'lodash'
  import { mapGetters } from 'vuex'
  import TemplateRenderer from './TemplateRenderer.vue'
  import { renderItemsToCanvas } from '../../services/png_renderer'

  const
    RENDER_DELAY_MS = 80,
    CONTAINER_ID = "#template-container"

  export default {
    props: {
      template: {
        required: true
      },
      item: {
        required: true
      },
    },

    components: { TemplateRenderer },

    updated() { this.renderPNG() },

    computed: {
      ...mapGetters([
        "projectItemThroughTemplate",
      ]),

      width() {
        return this.template.size.w*150
      },

      height() {
        return this.template.size.h*150
      },
    },

    methods: {
      renderPNG: debounce(function() {
        // all store fetching, input validation, magic transformation, and data aggregation
        return this.projectItemThroughTemplate(this.item, this.template)

          // all rendering
          .then((item) => {
            renderItemsToCanvas([item], CONTAINER_ID, this.width, this.height)
          })
      }, RENDER_DELAY_MS)
    }
  }

</script>

<style scoped>
  canvas {
    max-width: 100%;
    max-height: 100%;
  }
</style>
