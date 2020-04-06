<template lang="pug">
div
  v-flex
    v-btn-toggle(v-model="rendererComponent" mandatory)
      v-tooltip(top)
        | PNG Renderer (experimental)
        v-btn(slot="activator" flat value="png-template-renderer")
          v-icon mdi-file-image
      v-tooltip(top)
        | PDF Renderer
        v-btn(slot="activator" flat value="pdf-template-renderer")
          v-icon mdi-file-pdf

  v-pagination(v-model="currentItemIndex" :length="totalItems")

  v-flex
    component(v-if="currentItem" :is="rendererComponent" :template="template" :item="currentItem")
    p(v-else) Nothing to render.

  v-pagination(v-model="currentItemIndex" :length="totalItems")
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { clamp } from 'lodash'
  import PDFTemplateRenderer from './PDFTemplateRenderer.vue'
  import PNGTemplateRenderer from './PNGTemplateRenderer.vue'

  export default {
    props: ["game", "component", "item"],

    components: {
      "pdf-template-renderer": PDFTemplateRenderer,
      "png-template-renderer": PNGTemplateRenderer,
    },

    mounted() { this.setActiveItem(this.currentItem) },

    data() {
      return {
        currentItemIndex: 1,
        rendererComponent: "pdf-template-renderer"
      }
    },

    computed: {
      ...mapGetters([
        "getComponentItems",
        "findComponentTemplate"
      ]),

      items() {
        return this.getComponentItems(this.component)
      },

      totalItems() {
        return this.items.length
      },

      currentItem() {
        return this.items[this.currentItemIndex-1]
      },

      template() {
        return this.findComponentTemplate(this.component)
      },
    },

    methods: mapActions(["setActiveItem"]),

    watch: {
      currentItem(newItem, oldItem) {
        this.setActiveItem(newItem)
      }
    }
  }
</script>
