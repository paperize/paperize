<template lang="pug">
modal.image-manager(name="Image Library" height="auto" :pivotY="0.25" :scrollable="true")
  .grid-x.grid-padding-x(@dragenter.stop.prevent="" @dragover.stop.prevent="" @drop.stop.prevent="handleFileDragAndDrop")
    .small-12.cell
      h1 Image Library

    .small-12.cell
      input(id="image-files-input" type="file" multiple @change="handleFileInput")

      ul
        li(v-for="image in images")
          a(:title="image.id" @click="preview(image)") {{ image.name }}

      img(v-if="previewImage" :src="previewImage")

      input(id="image-files-input" type="file" multiple @change="handleFileInput")


  button.close-button(aria-label="Close modal" type="button" @click="$modal.hide('Image Library')")
    span(aria-hidden="true") &times;
</template>

<script>
  import { mapGetters } from 'vuex'
  import { each } from 'lodash'
  import persistence from '../../store/pouch_persistence'

  export default {
    data() {
      return {
        previewImage: null
      }
    },

    computed: mapGetters(['images']),

    methods: {
      preview(image) {
        persistence.db.get(image.id).then((imageAsset) => {
          this.previewImage = imageAsset.data
        })
      },

      handleFileInput(changeEvent) {
        // Extract files from a file input
        let files = changeEvent.target.files
        this.$store.dispatch('importImageFiles', files)
      },

      handleFileDragAndDrop(dropEvent) {
        // Extract files from a drag-and-drop event
        let files = dropEvent.dataTransfer.files
        this.$store.dispatch('importImageFiles', files)
      }
    }
  }
</script>
