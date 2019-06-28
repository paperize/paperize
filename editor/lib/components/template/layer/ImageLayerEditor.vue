<template lang="pug">
v-expansion-panel#image-layer-editor(popout)
  name-editor(:layer="layer")

  dimension-editor(:dimensions="dimensions" :size="templateSize")

  v-expansion-panel-content
    div(slot="header") Image Selection
    v-card
      v-card-text
        v-radio-group(label="Selection Style:" v-model="imageNameStatic" row)
          v-radio(color="primary" label="Static" :value="true")
          v-radio(color="primary" label="Dynamic" :value="false")

        template(v-if="imageNameStatic")
          v-btn(@click="pickImageFromDrive") Pick Image...
          //- v-autocomplete(v-model="imageId" :items="allImages" item-text="name" item-value="id" box label="Select an Image")

        template(v-else)
          v-text-field(v-model="imageNamePrefix" label="Prefix" box)
          v-select.image-name-property(v-model="imageNameProperty" :items="activeSheetProperties" box)
          v-text-field.image-name-suffix(v-model="imageNameSuffix" label="Suffix" box)
          v-text-field(disabled label="Looks like" :value="dynamicImageName" box)

  v-expansion-panel-content
    div(slot="header") Image Alignment
    v-card
      v-card-text
        v-layout(row)
          v-flex(shrink)
            magic-property-input-talker(slot="prepend-inner" :layer="layer" attributeName="imageScaling")
          v-flex
            v-radio-group(label="Scaling:" v-model="imageScaling" row)
              v-radio(color="primary" label="Fit" value="fitToBox")
              v-radio(color="primary" label="Fill" value="fillToBox")

        p Horizontal:
        magic-property-input-talker(:layer="layer" attributeName="horizontalAlignment")
        v-btn-toggle(v-model="horizontalAlignment")
          v-btn(small flat value="left") Left
          v-btn(small flat value="center") Center
          v-btn(small flat value="right") Right

        p Vertical:
        magic-property-input-talker(:layer="layer" attributeName="verticalAlignment")
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
  import { openImagePicker } from '../../../services/google/picker'
  import NameEditor from './NameEditor.vue'
  import DimensionEditor from './DimensionEditor.vue'
  import MagicPropertyInputTalker from '../../source/MagicPropertyInputTalker.vue'

  export default {
    props: ["layer"],

    components: {
      NameEditor,
      DimensionEditor,
      MagicPropertyInputTalker
    },

    computed: {
      ...mapGetters([
        "getLayerDimensions",
        "findTemplateByLayerId",
        "activeSheetProperties"
      ]),

      dimensions() { return this.getLayerDimensions(this.layer) },

      templateSize() {
        return this.findTemplateByLayerId(this.layer.id).size
      },

      ...computedVModelUpdateAll("layer", "patchLayer", [
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
      ...mapActions(["patchLayer"]),

      getImageLabel(imageItem) { return imageItem },

      pickImageFromDrive() {
        return openImagePicker(this.workingDirectoryId)
          .then((imageId) => {
            this.imageId = imageId
          })
      }
    }
  }
</script>
