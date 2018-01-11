<template lang="pug">
.shape-layer-fields
  fieldset.fieldset
    legend
      input(type="checkbox" v-model="strokePresent")
      = " Stroke? "
      i.fas.fa-edit

    .grid-x.grid-margin-x(v-if="strokePresent")
      .small-6.large-3.cell
        label
          strong Color:
      .small-6.large-3.cell
        input(type="color" v-model="strokeColor")

      .small-6.large-3.cell
        label
          strong Width:
      .small-6.large-3.cell
        input(type="number" v-model.number="strokeWidth")

  fieldset.fieldset
    legend
      input(type="checkbox" v-model="fillPresent")
      = " Fill? "
      i.fas.fa-pen-square

    .grid-x.grid-margin-x(v-if="fillPresent")
      .small-6.large-3.cell
        label
          strong Color:
      .small-6.large-3.cell
        input(type="color" v-model="fillColor")
</template>

<script>
  import { mapActions } from 'vuex'
  import { computedVModelUpdateAll } from '../../../store/component_helper'

  export default {
    props: ["layer"],

    computed: computedVModelUpdateAll("layer", "updateLayer", [
      "strokePresent",
      "strokeWidth",
      "strokeColor",
      "fillPresent",
      "fillColor"
    ]),

    methods: mapActions(["updateLayer"])
  }
</script>
