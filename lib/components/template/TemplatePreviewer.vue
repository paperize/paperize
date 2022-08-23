<template lang="pug">
v-layout(wrap justify-center)
  v-pagination(v-model="currentItemIndex" :length="totalItems")

  v-btn-toggle(v-model="exportFormat")
    v-btn(value="pdf") .PDF
    v-btn(value="jpg") .JPG
    v-btn(value="png") .PNG
    v-btn(value="svg") .SVG

  p(v-if="!currentItem") Nothing to render.

  template(v-else)
    template-renderer(:exportFormat="exportFormat" :game="game" :component="component" :item="currentItem")

  v-pagination(v-model="currentItemIndex" :length="totalItems")
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { clamp } from 'lodash'
  import TemplateRenderer from './TemplateRenderer.vue'

  export default {
    props: ["game", "component", "item"],

    components: { TemplateRenderer },

    mounted() { this.setActiveItem(this.currentItem) },

    data() {
      return {
        currentItemIndex: 1,
        exportFormat: 'svg'
      }
    },

    computed: {
      ...mapGetters(["getComponentItems"]),

      items() {
        return this.getComponentItems(this.component)
      },

      totalItems() {
        return this.items.length
      },

      currentItem() {
        return this.items[this.currentItemIndex-1]
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
