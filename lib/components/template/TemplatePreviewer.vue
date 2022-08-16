<template lang="pug">
div
  v-layout
    v-flex(xs12)
      v-autocomplete(label="Go To Card:" v-model="inputIndex" :items="itemsIndex" filled)

  v-layout
    v-flex(xs12)
      template-renderer(v-if="currentItem" :game="game" :component="component" :item="currentItem")
      p(v-else) Nothing to render.

  v-layout
    v-flex(xs12)
      v-pagination(v-model="currentItemIndex" :length="totalItems")

  v-layout
    v-flex(xs12)
      print-log(export-type="item")
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { clamp, range } from 'lodash'

import TemplateRenderer from './TemplateRenderer.vue'
import PrintLog from '../print/PrintLog.vue'

export default {
  props: ["game", "component", "item"],

  components: { PrintLog, TemplateRenderer },

  mounted() { this.setActiveItem(this.currentItem) },

  data() {
    return {
      currentItemIndex: 1,
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
