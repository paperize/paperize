<template lang="pug">
div
  fieldset.fieldset
    legend Image Source

    .grid-x.grid-margin-x
      .shrink.cell
        input(type="radio" id="radio-static" :value="true" v-model="imageNameStatic")
        label(for="radio-static") Static

        input(type="radio" id="radio-dynamic" :value="false" v-model="imageNameStatic")
        label(for="radio-dynamic") Dynamic

    .grid-x.grid-margin-x(v-if="imageNameStatic")
      .shrink.cell
        label
          strong Static Name:
      .auto.cell
        input(type="text" v-model="imageName")

    .grid-x.grid-margin-x(v-else)
      .small-4.cell
        label
          strong Prefix:
      .small-8.cell
        input(type="text" v-model="imageNamePrefix")

      .small-4.cell
        label
          strong Property:
      .small-8.cell
        select(type="text" v-model="imageNameProperty")
          option(value="Rank") Rank
          option(value="Name") Name

      .small-4.cell
        label
          strong Suffix:
      .small-8.cell
        input(type="text" v-model="imageNameSuffix")

      .small-4.cell
        label
          strong Dynamic Name:
      .small-8.cell
        input(type="text" disabled :value="dynamicImageName")

  fieldset.fieldset
    legend Image Alignment

    .grid-x.grid-margin-x
      .shrink.cell
        label
          strong Horizontal:
      .auto.cell
        select(v-model="horizontalAlignment")
          option(value="left") Left
          option(value="center") Center
          option(value="right") Right

    .grid-x.grid-margin-x
      .shrink.cell
        label
          strong Vertical:
      .auto.cell
        select(v-model="verticalAlignment")
          option(value="top") Top
          option(value="middle") Middle
          option(value="bottom") Bottom
</template>

<script>
  import { mapActions } from 'vuex'
  import { debounce } from 'lodash'
  import { computedVModelUpdateAll } from '../../../store/component_helper'

  export default {
    props: ["layer"],

    computed: {
      ...computedVModelUpdateAll("layer", "updateLayer", [
        "imageNameStatic",
        "imageName",
        "imageNamePrefix",
        "imageNameProperty",
        "imageNameSuffix",
        "horizontalAlignment",
        "verticalAlignment",
      ]),

      dynamicImageName() {
        return `${this.layer.imageNamePrefix}[${this.layer.imageNameProperty}]${this.layer.imageNameSuffix}`
      }
    },

    methods: {
      updateLayer: debounce(function({ layer, keyValueObject }) {
        this.$store.dispatch("updateLayer", { layer, keyValueObject})
      }, 400, { leading: true })
    }
  }
</script>
