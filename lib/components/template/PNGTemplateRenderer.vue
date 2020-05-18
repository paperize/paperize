<template lang="pug">
  template-renderer(:renderer="renderPNG" :template="template" :item="item")
    v-layout
      v-flex(xs-4)
        v-text-field.text-size(label="Pixels per Inch" v-model="pixelsPerInch" type="number" min="1" max="600" box)
      v-flex(xs-4)
        v-text-field.text-size(label="Font Scale Factor" v-model="fontScaleFactor" type="number" max="1000" step="1" box)
      v-flex(xs-4)
        v-text-field.text-size(label="Stroke Scale Factor" v-model="strokeScaleFactor" type="number" max="1000" step="1" box)

    label(for="pixel-resolution") PNG Resolution: {{ pngSize.w }}x{{ pngSize.h }} pixels

    v-card(height="420px")
      v-card-text
        #template-container(ref="canvasContainer")
</template>

<script>
  import { debounce, map } from 'lodash'
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
        pixelsPerInch: 150,
        fontScaleFactor: 2.0,
        strokeScaleFactor: 200,
      }
    },

    computed: {
      ...mapGetters([
        "projectItemThroughTemplate",
      ]),

      scalingOptions() {
        return {
          size: this.parsedPixelsPerInch,
          fonts: this.parsedFontScaleFactor,
          strokes: this.parsedStrokeScaleFactor
        }
      },

      parsedPixelsPerInch() { return parseInt(this.pixelsPerInch, 10) },
      parsedFontScaleFactor() { return parseFloat(this.fontScaleFactor) },
      parsedStrokeScaleFactor() { return parseFloat(this.strokeScaleFactor) },

      pngSize() {
        return scaleDimensions(this.template.size, this.pixelsPerInch)
      },
    },

    methods: {
      renderPNG: debounce(function() {
        // all store fetching, input validation, magic transformation, and data aggregation
        return this.projectItemThroughTemplate(this.item, this.template, this.scalingOptions)

          // all rendering
          .then((item) => {
            renderItemsToCanvas([item], CONTAINER_ID, this.pngSize.w, this.pngSize.h)
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
