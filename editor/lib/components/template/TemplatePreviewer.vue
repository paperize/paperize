<template lang="pug">
div
  template(v-if="!currentItem")
    p No items to render.

  template(v-else)
    .grid-x
      .auto.cell
      .shrink.cell
        ul.menu.horizontal
          li
            a(@click="previousItem") &lt;&lt;
          li
            | Item {{ currentItemIndex + 1 }} / {{ totalItems }}
          li
            a(@click="nextItem") &gt;&gt;
      .auto.cell

    .grid-x
      .auto.cell
      .shrink.cell
        template-renderer(:game="game" :component="component" :item="currentItem")
      .auto.cell

    .grid-x
      .auto.cell
      .shrink.cell
        ul.menu.horizontal
          li
            a(@click="previousItem") &lt;&lt;
          li
            | Item {{ currentItemIndex + 1 }} / {{ totalItems }}
          li
            a(@click="nextItem") &gt;&gt;
      .auto.cell
</template>

<script>
  import { mapGetters } from 'vuex'
  import { clamp } from 'lodash'
  import pdfRenderer from './template_examples'
  import TemplateRenderer from './TemplateRenderer.vue'

  export default {
    props: ["game", "component", "item"],

    components: {
      'template-renderer': TemplateRenderer
    },

    data() {
      return {
        currentItemIndex: 0,
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
        return this.items[this.currentItemIndex]
      },
    },

    methods: {
      previousItem() {
        this.currentItemIndex = clamp(this.currentItemIndex - 1, 0, this.totalItems - 1)
      },

      nextItem() {
        this.currentItemIndex = clamp(this.currentItemIndex + 1, 0, this.totalItems - 1)
      },
    }
  }
</script>
