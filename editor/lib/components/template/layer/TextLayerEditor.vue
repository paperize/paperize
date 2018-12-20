<template lang="pug">
v-layout(column)
  v-flex
    .subheading Text Look &amp; Feel

  v-flex
    v-select(label="Font Family" v-model="textFontName" :items="availableFontNames" @change="ensureValidStyle()")

  v-flex
    v-select(label="Font Style" v-model="textFontStyle" :items="availableFontStyles")

  v-flex
    color-picker(v-model="textColor")
  v-flex
    v-text-field.text-size(v-model="textSize" type="number" min="1" max="128" label="Text Size")
  v-flex
    p Horizontal Alignment
    v-btn-toggle(v-model="horizontalAlignment")
      v-btn(small flat value="left") Left
      v-btn(small flat value="center") Center
      v-btn(small flat value="right") Right

  v-flex
    .subheading Text Content

  v-flex
    p(v-pre) Use curly brackets to reference columns, like: {{Name}}

  v-flex
    v-textarea.text-content(v-model="textContentTemplate" label="Text Template")
</template>

<script>
  import { debounce, keys } from 'lodash'
  import { mapActions } from 'vuex'
  import { computedVModelUpdateAll } from '../../util/component_helper'
  import ColorPicker from '../../shared/ColorPicker.vue'

  export default {
    props: ["layer", "source"],

    components: { ColorPicker },

    data() {
      return {
        availableFonts: {
          "helvetica": ["normal", "bold", "italic", "bolditalic"],
          "courier": ["normal", "bold", "italic", "bolditalic"],
          "times": ["normal", "bold", "italic", "bolditalic"],
          "symbol": ["normal"],
          "zapfdingbats": ["normal"],
        }
      }
    },

    computed: {
      availableFontNames() {
        return keys(this.availableFonts)
      },

      availableFontStyles() {
        return this.availableFonts[this.textFontName]
      },

      propertyNames() {
        return this.$store.getters.sourceProperties(this.source)
      },

      ...computedVModelUpdateAll("layer", "updateLayer", [
        "textFontName",
        "textFontStyle",
        "textContentTemplate",
        "textColor",
        "textSize",
        "horizontalAlignment",
        // "textFont",
      ])
    },

    methods: {
      updateLayer: debounce(function(layer) {
        this.$store.dispatch("updateLayer", layer)
      }, 650, { leading: true }),

      ensureValidStyle() {
        // Wait for styles to be reactively updated
        this.$nextTick(() => {
          // If our selected style vanished
          if(this.availableFontStyles.indexOf(this.textFontStyle) == -1) {
            // Default to a working style
            this.textFontStyle = this.availableFontStyles[0]
          }
        })
      },
    }
  }
</script>

<style scoped>
  textarea {
    height: 200px;
  }
</style>
