<template lang="pug">
v-expansion-panel#text-layer-editor(popout)
  name-editor(:layer="layer")

  dimension-editor(:dimensions="dimensions" :size="templateSize")

  v-expansion-panel-content
    div(slot="header") Font
    v-card
      v-card-text
        v-select(label="Font Family" v-model="textFontName" :items="availableFontNames" @change="ensureValidStyle()" box)
        v-select(label="Font Style" v-model="textFontStyle" :items="availableFontStyles" box)
        v-text-field.text-size(label="Text Size" v-model="textSize" type="number" min="1" max="128" box)
        color-picker(label="Text Color" v-model="textColor")

  v-expansion-panel-content
    div(slot="header") Text Alignment
    v-card
      v-card-text
        p Horizontal Alignment
        v-btn-toggle(v-model="horizontalAlignment")
          v-btn(small flat value="left") Left
          v-btn(small flat value="center") Center
          v-btn(small flat value="right") Right

        p Vertical Alignment
        v-btn-toggle(v-model="verticalAlignment")
          v-btn(small flat value="top") Top
          v-btn(small flat value="middle") Middle
          v-btn(small flat value="bottom") Bottom

  v-expansion-panel-content
    div(slot="header") Text Content
    v-card
      v-card-text
        p(v-pre) Use curly brackets to reference columns, like: {{Name}}

        v-textarea.text-content(v-model="textContentTemplate" label="Text Template" box)
</template>

<script>
  import { debounce, keys } from 'lodash'
  import { mapActions, mapGetters } from 'vuex'
  import { computedVModelUpdateAll } from '../../util/component_helper'
  import NameEditor from './NameEditor.vue'
  import DimensionEditor from './DimensionEditor.vue'
  import ColorPicker from '../../shared/ColorPicker.vue'

  export default {
    props: ["layer", "source"],

    components: {
      NameEditor,
      DimensionEditor,
      ColorPicker,
    },

    data() {
      return {
        availableFonts: {
          "Arial":        ["normal"],
          "helvetica":    ["normal", "bold", "italic", "bolditalic"],
          "courier":      ["normal", "bold", "italic", "bolditalic"],
          "times":        ["normal", "bold", "italic", "bolditalic"],
          "symbol":       ["normal"],
          "zapfdingbats": ["normal"],
        }
      }
    },

    computed: {
      ...mapGetters(["getLayerDimensions", "findTemplateByLayerId"]),

      dimensions() { return this.getLayerDimensions(this.layer) },

      templateSize() {
        return this.findTemplateByLayerId(this.layer.id).size
      },

      availableFontNames() {
        return keys(this.availableFonts)
      },

      availableFontStyles() {
        return this.availableFonts[this.textFontName]
      },

      propertyNames() {
        return this.$store.getters.sourceProperties(this.source)
      },

      ...computedVModelUpdateAll("layer", "patchLayer", [
        "textFontName",
        "textFontStyle",
        "textContentTemplate",
        "textColor",
        "textSize",
        "horizontalAlignment",
        "verticalAlignment",
      ])
    },

    methods: {
      ...mapActions(["patchLayer"]),

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
