<template lang="pug">
  template-renderer(:renderer="renderPNG" :game="game" :component="component" :item="item")
    canvas(ref="pngCanvas" :width="width" :height="height")
</template>

<script>
  import { debounce } from 'lodash'
  import { mapGetters } from 'vuex'
  import TemplateRenderer from './TemplateRenderer.vue'
  import pngRenderer from '../../services/png_renderer'

  const RENDER_DELAY_MS = 80

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

    updated() { this.renderPNG() },

    computed: {
      ...mapGetters(["findComponentTemplate"]),

      template() {
        return this.findComponentTemplate(this.component)
      },

      width() {
        return this.template.size.w*150
      },

      height() {
        return this.template.size.h*150
      },

      graphics() {
        const canvas = this.$refs.pngCanvas
        return canvas.getContext('2d')
      }
    },

    methods: {
      renderPNG: debounce(function() {
        if(this.template && this.graphics) {
          pngRenderer.renderItemToGraphics(this.graphics, this.game, this.component, this.item, this.template)
        }
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
