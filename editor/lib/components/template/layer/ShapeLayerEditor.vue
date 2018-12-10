<template lang="pug">
#shape-settings
  .subheading Shape

  v-select.shape-select(v-model="shape" :items="shapeOptions" label="Shape")

  v-checkbox(color="primary" v-model="strokePresent" label="Stroke?")
  color-picker(v-if="strokePresent" v-model="strokeColor")
  v-text-field(v-if="strokePresent" type="number" step="0.01" v-model.number="strokeWidth")

  v-checkbox(color="primary" v-model="fillPresent" label="Fill?")
  color-picker(v-if="fillPresent" v-model="fillColor")
</template>

<script>
  import { mapActions } from 'vuex'
  import { computedVModelUpdateAll } from '../../util/component_helper'
  import ColorPicker from '../../shared/ColorPicker.vue'

  const shapeOptions = [
    { value: "rectangle", text: "Rectangle" },
    { value: "roundedRectangle", text: "Rounded Rectangle" },
    { value: "ellipse", text: "Ellipse" },
  ]

  export default {
    props: ["layer"],

    components: { ColorPicker },

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
