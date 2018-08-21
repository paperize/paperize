<template lang="pug">
.text-layer-fields
  fieldset.fieldset
    legend Text Look &amp; Feel

    .grid-x.grid-margin-x
      .small-12.cell
        .input-group
          span.input-group-label
            label(for="text-color")
              strong Text Color
          input.input-group-field(id="text-color" type="color" v-model="textColor")

      .small-12.cell
        .input-group
          span.input-group-label
            label(for="text-size")
              strong Text Size
          select.input-group-field(id="text-size" v-model="textSize")
            option(v-for="size in [5, 6, 7, 8, 9, 10, 12, 16, 20, 24, 32, 48, 64, 72]" :value="size") {{ size }}


  fieldset.fieldset
    legend Text Content

    p(v-pre) Use curly brackets to reference columns, like: {{Name}}

    .grid-x.grid-margin-x
      .auto.cell
        strong From Template:
        textarea.text-content(v-model="textContentTemplate")
</template>

<script>
  import { debounce } from 'lodash'
  import { mapActions } from 'vuex'
  import { computedVModelUpdateAll } from '../../../store/component_helper'

  export default {
    props: ["layer", "source"],

    computed: {
      propertyNames() {
        return this.$store.getters.sourceProperties(this.source)
      },

      ...computedVModelUpdateAll("layer", "updateLayer", [
        // "textContentProperty",
        // "textContentProperty",
        "textContentTemplate",
        "textColor",
        "textSize",
        // "textFont",
      ])
    },

    methods: {
      updateLayer: debounce(function(layer) {
        this.$store.dispatch("updateLayer", layer)
      }, 650, { leading: true }),
    }
  }
</script>

<style scoped>
  textarea {
    height: 200px;
  }
</style>
