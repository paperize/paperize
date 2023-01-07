<template lang="pug">
div
  v-layout
    v-flex(xs12)
      v-autocomplete(label="Go To Item:" v-model="inputIndex" :items="itemsIndex" filled)

  v-layout
    v-flex(xs12)
      v-btn-toggle(v-model="exportFormat")
        v-btn(value="pdf") .PDF
        v-btn(value="jpg") .JPG
        v-btn(value="png") .PNG
        v-btn(value="svg") .SVG

  v-layout
    v-flex.preview-container(xs12)
      p(v-if="!currentItem") Nothing to render.

      template(v-else)
        template-renderer(:exportFormat="exportFormat" :game="game" :component="component" :item="currentItem")

  v-layout
    v-flex(xs12)
      v-pagination(v-model="currentItemIndex" :length="totalItems")

  v-layout
    v-flex(xs12)
      export-log(export-type="item" compact="true")
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { clamp, range } from 'lodash'

import TemplateRenderer from './TemplateRenderer.vue'
import ExportLog from '../print/ExportLog.vue'

export default {
  props: ["game", "component", "item"],

  components: { ExportLog, TemplateRenderer },

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

    itemsIndex() {
      return range(1, this.totalItems+1)
    },

    currentItem() {
      return this.items[this.currentItemIndex-1]
    },

    inputIndex: {
      get() { return this.currentItemIndex },
      set(newIndex) { this.currentItemIndex = clamp(newIndex, 1, this.totalItems) }
    }
  },

  methods: mapActions(["setActiveItem"]),

  watch: {
    currentItem(newItem, oldItem) {
      this.setActiveItem(newItem)
    }
  }
}
</script>

<style>
.preview-container * {
  max-width: 100%;
}
</style>
