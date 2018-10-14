<template lang="pug">
div
  template(v-if="!currentItem")
    p Nothing to render.

  template(v-else)
    v-pagination(v-model="currentItemIndex" :length="totalItems")

    v-flex
      template-renderer(:game="game" :component="component" :item="currentItem")

    v-pagination(v-model="currentItemIndex" :length="totalItems")
</template>

<script>
  import { mapGetters } from 'vuex'
  import { clamp } from 'lodash'
  import TemplateRenderer from './TemplateRenderer.vue'

  export default {
    props: ["game", "component", "item"],

    components: {
      'template-renderer': TemplateRenderer
    },

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
  }
</script>
