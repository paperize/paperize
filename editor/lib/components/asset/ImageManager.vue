<template lang="pug">
modal.image-manager(name="Image Library" height="auto" :pivotY="0.25" :scrollable="true")
  .grid-x.grid-padding-x(@dragenter.stop.prevent="" @dragover.stop.prevent="" @drop.stop.prevent="handleFileDragAndDrop")
    .small-12.cell
      h1 Image Library

    .small-12.cell(v-if="showImageSpinner")
      spinner(message="Importing images...")

    .small-12.cell(v-else)
      input(id="image-files-input" type="file" multiple @change="handleFileInput")

      table
        thead
          tr
            th Controls
            th Name
            th Preview
        tbody
          tr(v-for="image in images")
            td(v-if="editing[image.id]")
              .button.tiny(@click="stopEditing")
                = "Accept"
            td(v-else)
              .button.alert.tiny(@click="editImage(image)")
                = "Edit "
                i.fa.fa-pencil.fa-fw

            td(v-if="editing[image.id]")
              input(v-model="image.name")
            td(v-else)
              a(:title="image.id")  {{ image.name }}

            td
              img(src="//fillmurray.com/80/80")

      input(id="image-files-input" type="file" multiple @change="handleFileInput")


  button.close-button(aria-label="Close modal" type="button" @click="$modal.hide('Image Library')")
    span(aria-hidden="true") &times;
</template>

<script>
  import { mapGetters } from 'vuex'
  import Promise from 'bluebird'
  import assetStore from '../../services/asset_store'

  import spinner from 'vue-simple-spinner'

  export default {
    components: { spinner },

    data() {
      return {
        showImageSpinner: false,
        editing: {}
      }
    },

    computed: {
      ...mapGetters(['images']),

      // imageSources() {
      //   Promise.map(this.images, (image) => {
      //     return assetStore.getImage(image.id).then((imageAsset) => {
      //       this.imageSourcesData[image.id] = imageAsset.data
      //     })
      //   })
      //
      //   return this.imageSourcesData
      // }
    },

    methods: {
      // preview(image) {
      //   assetStore.getImage(image.id).then((imageAsset) => {
      //     this.previewImage = imageAsset.data
      //   })
      // },

      editImage(image) {
        this.editing = {}
        this.editing[image.id] = true
      },

      stopEditing() { this.editing = {} },

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
