<template lang="pug">
div
  v-pagination(v-model="currentItemIndex" :length="totalItems")

  v-flex
    //- pdf-template-renderer(v-if="currentItem" :game="game" :component="component" :item="currentItem")
    png-template-renderer(v-if="currentItem" :template="template" :item="currentItem")
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
