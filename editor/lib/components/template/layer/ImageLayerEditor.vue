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
    div(slot="header") Image Selection
    v-card
      v-card-text
        v-radio-group(label="Selection Style:" v-model="imageNameStatic" row)
          v-radio(color="primary" label="Static" :value="true")
          v-radio(color="primary" label="Dynamic" :value="false")

        template(v-if="imageNameStatic")
          v-autocomplete(v-model="imageId" :items="imageIndex" item-text="name" item-value="id" box label="Select an Image")

        template(v-else)
          v-text-field(v-model="imageNamePrefix" label="Prefix")
          v-select(v-model="imageNameProperty" :items="activeSourceProperties")
          v-text-field(v-model="imageNameSuffix" label="Suffix")
          v-text-field(disabled label="Looks like" :value="dynamicImageName")

  v-expansion-panel-content
    div(slot="header") Image Alignment
    v-card
      v-card-text
        v-radio-group(label="Scaling:" v-model="imageScaling" row)
          v-radio(color="primary" label="Fit" value="fitToBox")
          v-radio(color="primary" label="Fill" value="fillToBox")

        p Horizontal Alignment
        v-btn-toggle(v-model="horizontalAlignment")
          v-btn(small flat value="left") Left
          v-btn(small flat value="center") Center
          v-btn(small flat value="right") Right

        p Vertical Alignment
        v-btn-toggle(v-model="verticalAlignment")
          v-btn(small flat value="top") Top
          v-btn(small flat value="middle") Middle
          v-btn(small flat value="bottom") Bottom
</template>

<script>
  import Vue from 'vue'
  import { mapActions, mapGetters } from 'vuex'
  import { debounce } from 'lodash'
  import { computedVModelUpdateAll } from '../../util/component_helper'
  import NameEditor from './NameEditor.vue'
  import DimensionEditor from './DimensionEditor.vue'

  export default {
    props: ["layer"],

    components: {
      NameEditor,
      DimensionEditor,
    },

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
