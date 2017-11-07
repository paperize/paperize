<template lang="pug">
modal.image-manager(name="Image Library" height="auto" :pivotY="0.25" :scrollable="true")
  .grid-x.grid-padding-x(@dragenter.stop.prevent="" @dragover.stop.prevent="" @drop.stop.prevent="handleFileDragAndDrop")
    .small-12.cell
      h1 Image Library

    .small-12.cell(v-if="showImageSpinner")
      spinner(message="Importing images...")

    .small-12.cell(v-else)
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
  import assetStore from '../../services/asset_store'

  import spinner from 'vue-simple-spinner'

  export default {
    components: { spinner },

    data() {
      return {
        previewImage: null,
        showImageSpinner: false
      }
    },

    computed: mapGetters(['images']),

    methods: {
      preview(image) {
        assetStore.getImage(image.id).then((imageAsset) => {
          this.previewImage = imageAsset.data
        })
      },

      handleFileInput(changeEvent) {
        // Extract files from a file input
        let files = changeEvent.target.files
        this.showImageSpinner = true
        this.$store.dispatch('importImageFiles', files).finally(() => {
          this.showImageSpinner = false
        })
      },

      handleFileDragAndDrop(dropEvent) {
        // Extract files from a drag-and-drop event
        let files = dropEvent.dataTransfer.files
        this.showImageSpinner = true
        this.$store.dispatch('importImageFiles', files).finally(() => {
          this.showImageSpinner = false
        })
      }
    }
  }
</script>
