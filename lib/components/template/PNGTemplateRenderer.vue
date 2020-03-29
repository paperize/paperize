<template lang="pug">
  template-renderer(:renderer="renderPNG" :game="game" :component="component" :item="item")
    canvas(ref="pngCanvas" width=400 height=600)
</template>

<script>
  import { debounce } from 'lodash'
  import { mapGetters } from 'vuex'
  import TemplateRenderer from './TemplateRenderer.vue'
  import pngRenderer from '../../services/png_renderer'

  const RENDER_DELAY_MS = 35

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

    data() {
      return {
        pdfBlob: null
      }
    },

    computed: {
      ...mapGetters(["findComponentTemplate"]),

      template() {
        return this.findComponentTemplate(this.component)
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
