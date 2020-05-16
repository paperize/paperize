<template lang="pug">
  template-renderer(:renderer="renderPNG" :template="template" :item="item")
    v-text-field.text-size(label="Pixels per Inch" v-model="pixelsPerInch" type="number" min="1" max="10000" box)

    label(for="pixel-resolution") PNG Resolution: {{ scaledSize.w }}x{{ scaledSize.h }} pixels

    v-card(height="420px")
      v-card-text
        #template-container(ref="canvasContainer")
</template>

<script>
  import { debounce } from 'lodash'
  import { mapGetters } from 'vuex'
  import TemplateRenderer from './TemplateRenderer.vue'
  import { renderItemsToCanvas } from '../../services/png_renderer'
  import { scaleDimensions } from '../../services/pdf_renderer/helpers'

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

    data() {
      return {
        pixelsPerInch: 70
      }
    },

    computed: {
      ...mapGetters([
        "projectItemThroughTemplate",
      ]),

      scaledSize() {
        return scaleDimensions(this.template.size, this.pixelsPerInch)
      }
    },

    methods: {
      renderPNG: debounce(function() {
        // all store fetching, input validation, magic transformation, and data aggregation
        return this.projectItemThroughTemplate(this.item, { ...this.template, size: this.scaledSize })

          // all rendering
          .then((item) => {
            renderItemsToCanvas([item], CONTAINER_ID, this.scaledSize.w, this.scaledSize.h)
          })

          .then(() => {
            // dirty style-setting on the generated canvas and its parent
            const
              parent = this.$refs.canvasContainer.children[0],
              canvas = parent.children[0]

            // this fits the canvas to the container, regardless its resolution
            parent.setAttribute("style", "width: initial; height: initial;")
            canvas.setAttribute("style", "max-height: 400px;")
          })
      }, RENDER_DELAY_MS)
    }
  }

</script>

<style scoped>
  /* .konvajs-content canvas {
    width: 500px;
    max-width: 500px;
  } */
</style>
