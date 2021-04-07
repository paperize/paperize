<template lang="pug">
v-expansion-panel#text-layer-editor(popout)
  name-editor(:layer="layer")

  dimension-editor(:dimensions="dimensions" :size="templateSize")

  v-expansion-panel-content.font-settings
    div(slot="header") Font
    v-card
      v-card-text
        p Need inspiration? <a href="https://fonts.google.com" target="_blank">Browse Google Fonts</a>
        v-autocomplete(label="Font Family" v-model="textFontName" :items="allFonts" item-value="family" item-text="family" class="font-family-setting" box)
          //- magic-property-input-talker(slot="prepend-inner" :layer="layer" attributeName="textFontName")

        v-autocomplete(label="Font Style" v-model="textFontStyle" :items="availableFontStyles" class="font-style-setting" box)
          //- magic-property-input-talker(slot="prepend-inner" :layer="layer" attributeName="textFontStyle")

        v-text-field.text-size(label="Text Size" v-model="textSize" type="number" min="1" max="128" box)
          magic-property-input-talker(slot="prepend-inner" :layer="layer" attributeName="textSize")

        v-layout(row)
          v-flex(shrink)
            magic-property-input-talker(slot="prepend-inner" :layer="layer" attributeName="textColor")
          v-flex
            color-picker(label="Text Color" v-model="textColor")

  v-expansion-panel-content
    div(slot="header") Text Alignment
    v-card
      v-card-text
        p Horizontal Alignment
        magic-property-input-talker(:layer="layer" attributeName="horizontalAlignment")
        v-btn-toggle(v-model="horizontalAlignment")
          v-btn(small flat value="left") Left
          v-btn(small flat value="center") Center
          v-btn(small flat value="right") Right
          v-btn(small flat value="justify") Justify

        p Vertical Alignment
        magic-property-input-talker(:layer="layer" attributeName="verticalAlignment")
        v-btn-toggle(v-model="verticalAlignment")
          v-btn(small flat value="top") Top
          v-btn(small flat value="middle") Middle
          v-btn(small flat value="bottom") Bottom

  v-expansion-panel-content
    div(slot="header") Text Content
    v-card
      v-card-text
        p(v-pre) Use triple curly-braces to reference columns, like: {{{Name}}}

        v-tooltip(top)
          | Name a column "{{ layer.name }}" and leave this blank to pull from your spreadsheet.
          v-icon(slot="activator") mdi-table-search
        v-textarea.text-content(v-model="textContentTemplate" label="Text Template" box :placeholder="`{{{${layer.name}}}}`")
</template>

<script>
  import { debounce, find } from 'lodash'
  import { mapActions, mapGetters } from 'vuex'
  import { computedVModelUpdateAll } from '../../util/component_helper'
  import NameEditor from './NameEditor.vue'
  import DimensionEditor from './DimensionEditor.vue'
  import ColorPicker from '../../shared/ColorPicker.vue'
  import MagicPropertyInputTalker from '../../source/MagicPropertyInputTalker.vue'


  export default {
    props: ["layer", "source"],

    mounted() { this.fetchGoogleFonts() },

    components: {
      NameEditor,
      DimensionEditor,
      ColorPicker,
      MagicPropertyInputTalker,
    },

    computed: {
      ...mapGetters([
        "getLayerDimensions",
        "findTemplateByLayerId",
        "allFonts"
      ]),

      dimensions() { return this.getLayerDimensions(this.layer) },

      templateSize() {
        const template = this.findTemplateByLayerId(this.layer.id)
        return template && template.size
      },

      availableFontStyles() {
        const font = find(this.allFonts, { family: this.textFontName })

        return font && font.variants || []
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
      ...mapActions(["patchLayer", "fetchGoogleFonts"]),

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
    },

    watch: {
      availableFontStyles: "ensureValidStyle"
    }
  }
</script>

<style scoped>
  textarea {
    height: 200px;
  }
</style>
