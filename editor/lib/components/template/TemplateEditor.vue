<template lang="pug">
.grid-x.grid-padding-x
  .small-12.cell
    h4 Template Editor
    hr

  .small-4.cell
    h5 Layers

    .grid-x
      .small-12.cell
        ul.menu.horizontal
          li Size of Component:
          li
            a(@click="setPageMode('preset')") Preset
          li
            a(@click="setPageMode('custom')") Custom

      template(v-if="pageMode === 'preset'")
        .small-5.cell
          label Format:
          select(v-model="templateWidth")
            option(v-for="pageFormat in pageFormats" :value="pageFormat")
              | {{ capitalize(pageFormat.replace("-", " ")) }}

        .small-7.cell
          label Orientation:
          select(v-model="templateHeight")
            option(value="portrait") Portrait
            option(value="landscape") Landscape

      template(v-else-if="pageMode === 'custom'")
        .small-6.cell
          label Width:
          input(type="number" v-model="templateWidth")

        .small-6.cell
          label Height:
          input(type="number" v-model="templateHeight")

    layer-manager(:template="component.template")

  .small-4.cell
    h5 Layer Config
  .small-4.cell
    h5 Preview

    template-previewer.inline-preview(:game="activeGame" :component="activeComponent")
</template>

<script>
  import _ from 'lodash'
  import { mapGetters } from 'vuex'

  import LayerManager from './layer/LayerManager.vue'
  import TemplatePreviewer from './TemplatePreviewer.vue'

  export default {
    props: ["component"],

    components: {
      "template-previewer": TemplatePreviewer,
      "layer-manager": LayerManager
    },

    data() {
      return {
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

      templateWidth: {
        get() { return this.component.template.size.w },
        set(newWidth) {
          const newSize = { w: newWidth, h: this.component.template.size.h }
          this.$store.commit("updateTemplateSize", { template: this.component.template, size: newSize })
        }
      },

      templateHeight: {
        get() { return this.component.template.size.h },
        set(newHeight) {
          const newSize = { w: this.component.template.size.w, h: newHeight }
          this.$store.commit("updateTemplateSize", { template: this.component.template, size: newSize })
        }
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
    }
  }
</script>
