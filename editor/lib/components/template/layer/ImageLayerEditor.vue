<template lang="pug">
.image-layer-fields
  fieldset.fieldset
    legend Image Name

    .grid-x.grid-margin-x
      .small-12.large-6.cell
        input(type="radio" id="radio-static" :value="true" v-model="imageNameStatic")
        label(for="radio-static") Static

      .small-12.large-6.cell
        input(type="radio" id="radio-dynamic" :value="false" v-model="imageNameStatic")
        label(for="radio-dynamic") Dynamic

    .grid-x.grid-margin-x(v-if="imageNameStatic")
      .small-12.large-6.cell
        label
          strong Image Name:
      .small-12.large-6.cell
        v-autocomplete(:items="imageItems" v-model="imageName" :get-label="getImageLabel")

    .grid-x.grid-margin-x(v-else)
      .small-12.cell
        .input-group
          span.input-group-label
            label(for="image-prefix")
              strong Prefix
          input.input-group-field(id="image-prefix" type="text" v-model="imageNamePrefix")

      .small-12.cell
        .input-group
          span.input-group-label
            label(for="image-name-property")
              strong Property
          select.input-group-field(id="image-name-property" v-model="imageNameProperty")
            option(v-for="property in activeSourceProperties" :value="property") {{ property }}

      .small-12.cell
        .input-group
          span.input-group-label
            label(for="image-suffix")
              strong Suffix
          input.input-group-field(id="image-suffix" type="text" v-model="imageNameSuffix")

      .small-12.cell
        .input-group
          span.input-group-label
            label
              strong Dynamic Name
          input.input-group-field(type="text" disabled :value="dynamicImageName")

  fieldset.fieldset
    legend Image Alignment

    .grid-x.grid-margin-x
      .small-12.cell
        label
          strong Scaling:

        input(type="radio" id="radio-fit" value="fitToBox" v-model="imageScaling")
        label(for="radio-fit") Fit

        input(type="radio" id="radio-fill" value="fillToBox" v-model="imageScaling")
        label(for="radio-fill") Fill

      .small-12.cell
        .input-group
          span.input-group-label
            label(for="horizontal-alignment")
              strong Horizontal
          select.input-group-field(id="horizontal-alignment" v-model="horizontalAlignment")
            option(value="left") Left
            option(value="center") Center
            option(value="right") Right

      .small-12.cell
        .input-group
          span.input-group-label
            label(for="vertical-alignment")
              strong Vertical
          select.input-group-field(id="vertical-alignment" v-model="verticalAlignment")
            option(value="top") Top
            option(value="middle") Middle
            option(value="bottom") Bottom
</template>

<script>
  import Vue from 'vue'
  import { mapActions, mapGetters } from 'vuex'
  import { debounce } from 'lodash'
  import { computedVModelUpdateAll } from '../../../store/component_helper'

  export default {
    props: ["layer"],

    computed: {
      ...mapGetters(["activeSourceProperties"]),

      ...computedVModelUpdateAll("layer", "updateLayer", [
        "imageNameStatic",
        "imageName",
        "imageNamePrefix",
        "imageNameProperty",
        "imageNameSuffix",
        "imageScaling",
        "horizontalAlignment",
        "verticalAlignment",
      ]),

      imageItems() {
        return this.$store.getters.images.map((image) => image.name)
      },

      dynamicImageName() {
        return `${this.layer.imageNamePrefix}[${this.layer.imageNameProperty}]${this.layer.imageNameSuffix}`
      }
    },

    methods: {
      getImageLabel(imageItem) { return imageItem },

      updateLayer: debounce(function({ layer, keyValueObject }) {
        this.$store.dispatch("updateLayer", { layer, keyValueObject})
      }, 400, { leading: true })
    }
  }
</script>

<style>
/* .v-autocomplete .v-autocomplete-input-group .v-autocomplete-input{
  font-size: 1.5em;
  padding: 10px 15px;
  box-shadow: none;
  border: 1px solid #157977;
  width: 80%;
  outline: none;
  background-color: #eee;
}
.v-autocomplete .v-autocomplete-input-group.v-autocomplete-selected .v-autocomplete-input {
  color: green;
  background-color: #f2fff2;
} */

.v-autocomplete .v-autocomplete-list {
  width: 100%;
  text-align: left;
  border: none;
  border-top: none;
  max-height: 400px;
  overflow-y: auto;
  border-bottom: 1px solid #157977;
}

.v-autocomplete .v-autocomplete-list .v-autocomplete-list-item {
  cursor: pointer;
  background-color: #fff;
  padding: 10px;
  border-bottom: 1px solid #157977;
  border-left: 1px solid #157977;
  border-right: 1px solid #157977;
}

.v-autocomplete .v-autocomplete-list .v-autocomplete-list-item:last-child {
  border-bottom: none;
}

.v-autocomplete .v-autocomplete-list .v-autocomplete-list-item:hover{
  background-color: #eee;
}
.v-autocomplete .v-autocomplete-list .v-autocomplete-list-item abbr {
  opacity: 0.8;
  font-size: 0.8em;
  display: block;
  font-family: sans-serif;
}
</style>
