<template lang="pug">

v-expansion-panels#shape-layer-editor(popout)
  name-editor(:layer="layer")

  dimension-editor(:dimensions="dimensions" :size="templateSize")

  v-expansion-panel

    v-expansion-panel-header.shape-settings Shape
    v-expansion-panel-content
      v-card
        v-card-text
          v-select.shape-select(v-model="shape" :items="shapeOptions" label="Shape" filled)
            magic-property-input-talker(slot="prepend-inner" :layer="layer" attributeName="shape")

  v-expansion-panel
    v-expansion-panel-header.stroke-settings Stroke
    v-expansion-panel-content
      v-card
        v-card-text
          v-layout
            v-flex(shrink)
              magic-property-input-talker(slot="prepend-inner" :layer="layer" attributeName="strokePresent")
            v-flex
              v-checkbox(color="primary" v-model="strokePresent" label="Stroke?")

          v-text-field(v-if="strokePresent" label="Stroke Width" type="number" step="0.01" v-model.number="strokeWidth" filled)
            magic-property-input-talker(slot="prepend-inner" :layer="layer" attributeName="strokeWidth")

          v-layout
            v-flex(shrink)
              magic-property-input-talker(slot="prepend-inner" :layer="layer" attributeName="strokeColor")
            v-flex
              color-picker(v-if="strokePresent" label="Stroke Color" v-model="strokeColor")

  v-expansion-panel
    v-expansion-panel-header.fill-settings Fill
    v-expansion-panel-content
      v-card
        v-card-text
          v-layout
            v-flex(shrink)
              magic-property-input-talker(slot="prepend-inner" :layer="layer" attributeName="fillPresent")
            v-flex
              v-checkbox(color="primary" v-model="fillPresent" label="Fill?")

          v-layout
            v-flex(shrink)
              magic-property-input-talker(slot="prepend-inner" :layer="layer" attributeName="fillColor")
            v-flex
              color-picker(v-if="fillPresent" label="Fill Color" v-model="fillColor" filled)
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { computedVModelUpdateAll } from '../../util/component_helper'
import NameEditor from './NameEditor.vue'
import DimensionEditor from './DimensionEditor.vue'
import ColorPicker from '../../shared/ColorPicker.vue'
import MagicPropertyInputTalker from '../../source/MagicPropertyInputTalker.vue'

const shapeOptions = [
  { value: "rectangle", text: "Rectangle" },
  { value: "roundedRectangle", text: "Rounded Rectangle" },
  { value: "ellipse", text: "Ellipse" },
]

export default {
  props: ["layer"],

  components: {
    NameEditor,
    DimensionEditor,
    ColorPicker,
    MagicPropertyInputTalker
  },

  data() {
    return {
      shapeOptions
    }
  },

  computed: {
    ...mapGetters(["getLayerDimensions", "findTemplateByLayerId"]),

    dimensions() { return this.getLayerDimensions(this.layer) },

    templateSize() {
      const template = this.findTemplateByLayerId(this.layer.id)
      return template && template.size
    },

    ...computedVModelUpdateAll("layer", "patchLayer", [
      "shape",
      "strokePresent",
      "strokeWidth",
      "strokeColor",
      "fillPresent",
      "fillColor"
    ])
  },

  methods: mapActions(["patchLayer"])
}
</script>
