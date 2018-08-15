<template lang="pug">
.shape-layer-fields
  fieldset.fieldset
    legend Shape

    select(v-model="shape")
      option(value="rectangle") Rectangle
      option(value="roundedRectangle") Rounded Rectangle
      option(value="ellipse") Ellipse

  fieldset.fieldset
    legend
      input(type="checkbox" v-model="strokePresent")
      = " Stroke? "
      i.fas.fa-edit

    .grid-x.grid-margin-x(v-if="strokePresent")
      .small-12.cell
        .input-group
          span.input-group-label
            label(for="stroke-color")
              strong Color
          input.input-group-field(id="stroke-color" type="color" v-model="strokeColor")

      .small-12.cell
        .input-group
          span.input-group-label
            label(for="stroke-width")
              strong Width
          input.input-group-field(id="stroke-width" type="number" step="0.01" v-model.number="strokeWidth")

  fieldset.fieldset
    legend
      input(type="checkbox" v-model="fillPresent")
      = " Fill? "
      i.fas.fa-pen-square

    .grid-x.grid-margin-x(v-if="fillPresent")
      .small-12.cell
        .input-group
          span.input-group-label
            label(for="fill-color")
              strong Color
          input.input-group-field(id="fill-color" type="color" v-model.number="fillColor")
</template>

<script>
  import { mapActions } from 'vuex'
  import { computedVModelUpdateAll } from '../../../store/component_helper'

  export default {
    props: ["layer"],

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
