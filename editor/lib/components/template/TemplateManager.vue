<template lang="pug">
#template-manager
  .grid-x.grid-margin-x
    .small-12.cell
      h5.truncate PDF Preview

    template(v-if="component.source")
      .small-12.cell
        ul.menu.horizontal
          li Page:
          li
            a(@click="setPageMode('preset')") Preset
          li
            a(@click="setPageMode('custom')") Custom

      template(v-if="pageMode === 'preset'")
        .small-5.cell
          label Format:
          select(v-model="componentPageWidth")
            option(v-for="pageFormat in pageFormats" :value="pageFormat")
              | {{ capitalize(pageFormat.replace("-", " ")) }}

        .small-7.cell
          label Orientation:
          select(v-model="componentPageHeight")
            option(value="portrait") Portrait
            option(value="landscape") Landscape

      template(v-else-if="pageMode === 'custom'")
        .small-6.cell
          label Width:
          input(type="number" v-model="componentPageWidth")

        .small-6.cell
          label Height:
          input(type="number" v-model="componentPageHeight")

      .small-12.cell
        hr

        ul.menu.horizontal
          li
            a(@click="previousItem") &lt;&lt;
          li
            | Item {{ currentItemIndex }} / {{ totalItems }}
          li
            a(@click="nextItem") &gt;&gt;
          li
            a.button.tiny(@click="$modal.show('Template Preview')") Show

        .card
          template-preview.inline-preview(:game="activeGame" :component="activeComponent" :item="currentItem")

        ul.menu.horizontal
          li
            a(@click="previousItem") &lt;&lt;
          li
            | Item {{ currentItemIndex }} / {{ totalItems }}
          li
            a(@click="nextItem") &gt;&gt;

      modal(name="Template Preview" width="90%" height="90%")
        template-preview.modal-preview(:game="activeGame" :component="activeComponent" :item="getComponentItems(component)[currentItemIndex]")

    p(v-else) Select a Source...
</template>

<script>
  import _ from 'lodash'
  import { mapGetters } from 'vuex'

  import TemplatePreview from './TemplatePreview.vue'

  export default {
    props: ["component"],

    components: {
      "template-preview": TemplatePreview
    },

    data() {
      return {
        currentItemIndex: 1,
        pdfBlob: null,
        pageMode: "preset",
        pageFormats: ['a0', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8',
          'a9', 'a10', 'b0', 'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8',
          'b9', 'b10', 'c0', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8',
          'c9', 'c10', 'dl', 'letter', 'government-letter', 'legal',
          'junior-legal', 'ledger', 'tabloid', 'credit-card']
      }
    },

    computed: {
      ...mapGetters(["activeGame", "activeComponent", "getComponentItems"]),

      componentPageWidth: {
        get() { return this.component.pageSize.w },
        set(newWidth) {
          const newPageSize = { w: newWidth, h: this.component.pageSize.h }
          this.$store.commit("updateComponentPageSize", { component: this.component, pageSize: newPageSize })
        }
      },

      componentPageHeight: {
        get() { return this.component.pageSize.h },
        set(newHeight) {
          const newPageSize = { w: this.component.pageSize.w, h: newHeight }
          this.$store.commit("updateComponentPageSize", { component: this.component, pageSize: newPageSize })
        }
      },

      items() {
        return this.getComponentItems(this.component)
      },

      totalItems() {
        return this.items.length
      },

      currentItem() {
        return this.items[this.currentItemIndex - 1]
      },

      source() {
        return this.component.source
      }
    },

    methods: {
      capitalize: _.capitalize,

      setPageMode(newPageMode) {
        this.pageMode = newPageMode

        if(this.pageMode === "preset") {

        } else if(this.pageMode === "custom") {

        }
      },

      previousItem() {
        this.currentItemIndex = Math.max(this.currentItemIndex - 1, 1)
      },

      nextItem() {
        this.currentItemIndex = Math.min(this.currentItemIndex + 1, this.totalItems)
      },
    }
  }
</script>

<style>
  .modal-preview {
    width: 100%;
    height: 100%;
  }

  .inline-preview {
    min-height: 400px;
  }
</style>
