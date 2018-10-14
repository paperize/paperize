<template lang="pug">
fieldset.fieldset.shape-settings
  legend Shape

  v-select(v-model="shape" :items="shapeOptions" label="Shape")

  v-checkbox(color="primary" v-model="strokePresent" label="Stroke?")
  v-text-field(v-if="strokePresent" type="color" v-model="strokeColor" label="Color")
  v-text-field(v-if="strokePresent" type="number" step="0.01" v-model.number="strokeWidth")

  v-checkbox(color="primary" v-model="fillPresent" label="Fill?")
  v-text-field(v-if="fillPresent" type="color" v-model="fillColor" label="Color")
</template>

<script>
  import { mapActions } from 'vuex'
  import { computedVModelUpdateAll } from '../../../store/component_helper'

  const shapeOptions = [
    { value: "rectangle", text: "Rectangle" },
    { value: "roundedRectangle", text: "Rounded Rectangle" },
    { value: "ellipse", text: "Ellipse" },
  ]

  export default {
    props: ["layer"],

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
