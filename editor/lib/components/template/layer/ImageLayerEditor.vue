<template lang="pug">
.image-layer-fields
  fieldset.fieldset
    legend Image Name

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
        v-autocomplete(:items="imageItems" v-model="imageName" :get-label="getImageLabel")

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
  import Vue from 'vue'
  import { mapActions } from 'vuex'
  import { debounce } from 'lodash'
  import { computedVModelUpdateAll } from '../../../store/component_helper'

  const imageTemplate = new Vue({
    props: ["item"],
    template: "<span>> {{ item }}</span>"
  })

  export default {
    props: ["layer"],

    data() {
      return {
        imageTemplate
      }
    },

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

      imageItems() {
        return this.$store.getters.images.map((image) => image.name)
      },

      dynamicImageName() {
        return `${this.layer.imageNamePrefix}[${this.layer.imageNameProperty}]${this.layer.imageNameSuffix}`
      }
    },

    methods: {
      getImageLabel(imageItem) { return imageItem },
      //
      // updateImageItems(searchText) {
      //   return this.imageItems()
      // },

      updateLayer: debounce(function({ layer, keyValueObject }) {
        this.$store.dispatch("updateLayer", { layer, keyValueObject})
      }, 400, { leading: true })
    }
  }
</script>

<style>
.v-autocomplete .v-autocomplete-input-group .v-autocomplete-input{
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
}

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
