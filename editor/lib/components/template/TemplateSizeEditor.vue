<template lang="pug">
.grid-x
  .small-12.cell
    ul.menu.horizontal
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
      input(type="number" v-model.number="templateWidth")

    .small-6.cell
      label Height:
      input(type="number" v-model.number="templateHeight")
</template>

<script>
  import { capitalize, isString } from 'lodash'
  export default {
    props: ["template"],

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
      templateWidth: {
        get() { return this.template.size.w },
        set(newWidth) {
          if(isString(newWidth) || newWidth < 0) { newWidth = 0 }
          const newSize = { ...this.template.size, w: newWidth  }
          this.$store.commit("updateTemplateSize", { template: this.template, size: newSize })
        }
      },

      templateHeight: {
        get() { return this.template.size.h },
        set(newHeight) {
          if(isString(newHeight) || newHeight < 0) { newHeight = 0 }
          const newSize = { ...this.template.size, h: newHeight }
          this.$store.commit("updateTemplateSize", { template: this.template, size: newSize })
        }
      }
    },

    methods: {
      capitalize,

      setPageMode(newPageMode) {
        this.pageMode = newPageMode

        if(this.pageMode === "preset") {

        } else if(this.pageMode === "custom") {

        }
      },
    }
  }
</script>
