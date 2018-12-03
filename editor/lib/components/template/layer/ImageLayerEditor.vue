<template lang="pug">
v-layout(column)
  v-flex
    .subheading Image Selection

  v-flex(xs12)
    v-radio-group(label="Selection Style:" v-model="imageNameStatic" row)
      v-radio(color="primary" label="Static" :value="true")
      v-radio(color="primary" label="Dynamic" :value="false")

  v-flex(xs12 v-if="imageNameStatic")
    v-autocomplete(v-model="imageId" :items="imageIndex" item-text="name" item-value="id" box label="Select an Image")

  v-flex(xs12 v-else)
    v-text-field(v-model="imageNamePrefix" label="Prefix")
    v-select(v-model="imageNameProperty" :items="activeSourceProperties")
    v-text-field(v-model="imageNameSuffix" label="Suffix")
    v-text-field(disabled label="Looks like" :value="dynamicImageName")

  v-flex
    .subheading Image Alignment

  v-flex(xs12)
    v-radio-group(label="Scaling:" v-model="imageScaling" row)
      v-radio(color="primary" label="Fit" value="fitToBox")
      v-radio(color="primary" label="Fill" value="fillToBox")

  v-flex(xs12)
    v-btn-toggle(label="Horizontal Alignment" v-model="horizontalAlignment")
      v-btn(small flat value="left") Left
      v-btn(small flat value="center") Center
      v-btn(small flat value="right") Right

  v-flex(xs12)
    v-btn-toggle(label="Vertical Alignment" v-model="verticalAlignment")
      v-btn(small flat value="top") Top
      v-btn(small flat value="middle") Middle
      v-btn(small flat value="bottom") Bottom
</template>

<script>
  import Vue from 'vue'
  import { mapActions, mapGetters } from 'vuex'
  import { debounce } from 'lodash'
  import { computedVModelUpdateAll } from '../../util/component_helper'

  export default {
    props: ["layer"],

    computed: {
      ...mapGetters(["activeSourceProperties", "imageIndex"]),

      ...computedVModelUpdateAll("layer", "updateLayer", [
        "imageNameStatic",
        "imageId",
        "imageNamePrefix",
        "imageNameProperty",
        "imageNameSuffix",
        "imageScaling",
        "horizontalAlignment",
        "verticalAlignment",
      ]),

      dynamicImageName() {
        return `${this.layer.imageNamePrefix}[${this.layer.imageNameProperty}]${this.layer.imageNameSuffix}`
      }
    },

    methods: {
      getImageLabel(imageItem) { return imageItem },

      updateLayer: debounce(function(layerUpdate) {
        this.$store.dispatch("updateLayer", layerUpdate)
      }, 400, { leading: true })
    }
  }
</script>
