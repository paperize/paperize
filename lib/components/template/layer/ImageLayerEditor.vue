<template lang="pug">
v-expansion-panels#image-layer-editor(popout)
  name-editor(:layer="layer")

  dimension-editor(:dimensions="dimensions" :size="templateSize")

  v-expansion-panel
    v-expansion-panel-header Image Selection
    v-expansion-panel-content
      v-card
        v-card-text
          v-alert(type="info" outlined)
            span(align="center")
              = "Images can be uploaded here: "
              file-uploader(:folderId="gameImagesFolderId")
          v-radio-group(label="Selection Style:" v-model="imageNameStatic" row)
            v-radio(color="primary" label="Static" :value="true")
            v-radio(color="primary" label="Dynamic" :value="false")

          template(v-if="imageNameStatic")
            v-btn(@click="pickImageFromDrive") Pick Image...
            //- v-autocomplete(v-model="imageId" :items="allImages" item-text="name" item-value="id" filled label="Select an Image")

          template(v-else)
            v-text-field(v-model="imageNamePrefix" label="Prefix" filled)
            v-select.image-name-property(v-model="imageNameProperty" :items="activeSheetProperties" filled)
            v-text-field.image-name-suffix(v-model="imageNameSuffix" label="Suffix" filled)
            v-text-field(disabled label="This Item" :value="dynamicImageName" filled)

  v-expansion-panel
    v-expansion-panel-header Image Alignment
    v-expansion-panel-content
      v-card
        v-card-text
          v-layout
            v-flex(shrink)
              magic-property-input-talker(slot="prepend-inner" :layer="layer" attributeName="imageScaling")
            v-flex
              v-radio-group(label="Scaling:" v-model="imageScaling" row)
                v-radio(color="primary" label="Fit" value="fitToBox")
                v-radio(color="primary" label="Fill" value="fillToBox")
                v-radio(color="primary" label="Stretch" value="stretch")

          p Horizontal:
          magic-property-input-talker(:layer="layer" attributeName="horizontalAlignment")
          v-btn-toggle(v-model="horizontalAlignment")
            v-btn(small text value="left") Left
            v-btn(small text value="center") Center
            v-btn(small text value="right") Right

          p Vertical:
          magic-property-input-talker(:layer="layer" attributeName="verticalAlignment")
          v-btn-toggle(v-model="verticalAlignment")
            v-btn(small text value="top") Top
            v-btn(small text value="middle") Middle
            v-btn(small text value="bottom") Bottom
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { findProperty } from '../../../services/pdf_renderer/helpers'
import { computedVModelUpdateAll } from '../../util/component_helper'
import { openImagePicker } from '../../../services/google/picker'
import NameEditor from './NameEditor.vue'
import DimensionEditor from './DimensionEditor.vue'
import MagicPropertyInputTalker from '../../source/MagicPropertyInputTalker.vue'
import FileUploader from '../../shared/FileUploader.vue'

export default {
  props: ["layer"],

  components: {
    NameEditor,
    DimensionEditor,
    MagicPropertyInputTalker,
    FileUploader
  },

  computed: {
    ...mapGetters([
      "workingDirectoryId",
      "getLayerDimensions",
      "findTemplateByLayerId",
      "gameImagesFolderOrDefault",
      "activeItem",
      "activeSheetProperties",
      "activeComponent",
      "activeGame",
    ]),

    gameImagesFolderId() {
      return this.gameImagesFolderOrDefault(this.activeGame).id
    },

    dimensions() { return this.getLayerDimensions(this.layer) },

    templateSize() {
      const template = this.findTemplateByLayerId(this.layer.id)
      return template && template.size
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
      const
        prefix = this.layer.imageNamePrefix,
        property = findProperty(this.activeItem, this.layer.imageNameProperty),
        suffix = this.layer.imageNameSuffix

      return `${prefix}${property}${suffix}`
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
