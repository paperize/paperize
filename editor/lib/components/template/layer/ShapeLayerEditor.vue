<template lang="pug">
v-expansion-panel(popout)
  v-expansion-panel-content
    div(slot="header") Layer Name: {{ layer.name }}
    v-card
      v-card-text
        name-editor(:layer="layer")

  v-expansion-panel-content
    div(slot="header") Dimensions
    v-card
      v-card-text
        dimension-editor(:layer="layer")

  v-expansion-panel-content
    div(slot="header") Shape
    v-card
      v-card-text
        v-select.shape-select(v-model="shape" :items="shapeOptions" label="Shape")

  v-expansion-panel-content
    div(slot="header") Stroke
    v-card
      v-card-text
        v-checkbox(color="primary" v-model="strokePresent" label="Stroke?")
        color-picker(v-if="strokePresent" v-model="strokeColor")
        v-text-field(v-if="strokePresent" type="number" step="0.01" v-model.number="strokeWidth")

  v-expansion-panel-content
    div(slot="header") Fill
    v-card
      v-card-text
        v-checkbox(color="primary" v-model="fillPresent" label="Fill?")
        color-picker(v-if="fillPresent" v-model="fillColor")
</template>

<script>
  import { mapActions } from 'vuex'
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

    computed: computedVModelUpdateAll("layer", "updateLayer", [
      "shape",
      "strokePresent",
      "strokeWidth",
      "strokeColor",
      "fillPresent",
      "fillColor"
    ]),

    methods: mapActions(["updateLayer"])
  }
</script>
