<template lang="pug">
v-expansion-panel#shape-layer-editor(popout)
  name-editor(:layer="layer")

  dimension-editor(:dimensions="dimensions" :size="templateSize")

  v-expansion-panel-content
    div(slot="header") Shape
    v-card
      v-card-text
        v-select.shape-select(v-model="shape" :items="shapeOptions" label="Shape" box)

  v-expansion-panel-content
    div(slot="header") Stroke
    v-card
      v-card-text
        v-checkbox(color="primary" v-model="strokePresent" label="Stroke?")
        v-text-field(v-if="strokePresent" label="Stroke Width" type="number" step="0.01" v-model.number="strokeWidth" box)
        color-picker(v-if="strokePresent" label="Stroke Color" v-model="strokeColor")

  v-expansion-panel-content
    div(slot="header") Fill
    v-card
      v-card-text
        v-checkbox(color="primary" v-model="fillPresent" label="Fill?")
        color-picker(v-if="fillPresent" label="Fill Color" v-model="fillColor" box)
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import { computedVModelUpdateAll } from '../../util/component_helper'
  import NameEditor from './NameEditor.vue'
  import DimensionEditor from './DimensionEditor.vue'
  import ColorPicker from '../../shared/ColorPicker.vue'

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
        return this.findTemplateByLayerId(this.layer.id).size
      },

      ...computedVModelUpdateAll("layer", "updateLayer", [
        "shape",
        "strokePresent",
        "strokeWidth",
        "strokeColor",
        "fillPresent",
        "fillColor"
      ])
    },

    methods: mapActions(["updateLayer"])
  }
</script>
