<template lang="pug">
div
  v-pagination(v-model="currentItemIndex" :length="totalItems")

  v-flex
    template-renderer(v-if="currentItem" :game="game" :component="component" :item="currentItem")
    p(v-else) Nothing to render.

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
