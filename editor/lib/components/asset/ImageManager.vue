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
            td(v-if="editing == image.id")
              a.button.tiny(@click="stopEditing")
                = "Accept"
            td(v-else)
              a.button.alert.tiny(@click="confirmDeletion(image)") X
              a.button.tiny(@click="editImage(image)")
                //- = "Edit "
                i.fa.fa-pencil.fa-fw

            td(v-if="editing == image.id")
              inline-image-editor(:image="image" @next="editNextImage(true)" @previous="editNextImage(false)")
            td(v-else)
              a(:title="image.id" @click="editImage(image)")  {{ image.name }}

            td.preview
              local-image(:imageId="image.id")

      input(id="image-files-input" type="file" multiple @change="handleFileInput")


  button.close-button(aria-label="Close modal" type="button" @click="$modal.hide('Image Library')")
    span(aria-hidden="true") &times;
</template>

<script>
  import { find, findIndex } from 'lodash'
  import { mapGetters, mapActions } from 'vuex'

  import spinner from 'vue-simple-spinner'
  import InlineImageEditor from './InlineImageEditor.vue'
  import LocalImage from './LocalImage.vue'

  export default {
    components: {
      spinner,
      'inline-image-editor': InlineImageEditor,
      'local-image': LocalImage
    },

    data() {
      return {
        showImageSpinner: false,
        editing: null
      }
    },

    computed: {
      ...mapGetters(['images']),
    },

    methods: {
      ...mapActions(["deleteImage"]),
      editImage(image) {
        this.editing = image.id
      },

      editNextImage(next) {
        let currentImageIndex = findIndex(this.images, find(this.images, { id: this.editing }))
        let nextImageIndex = currentImageIndex + (next ? 1 : -1)
        let nextImage = this.images[nextImageIndex]

        if(nextImage) {
          this.editImage(nextImage)
        } else {
          this.stopEditing()
        }
      },

      stopEditing() { this.editing = null },

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
      },

      confirmDeletion(image) {
        this.$modal.show('dialog', {
          title: `Are you sure you want to delete the image "${image.name}"?`,
          buttons: [
            {
              title: "No",
              default: true
            }, {
              title: "Yes",
              handler: () => {
                this.deleteImage({ image })
                this.$modal.hide('dialog')
              }
            }
          ]
        })
      }
    }
  }
</script>

<style>
  .preview img {
    max-width: 50px;
    max-height: 50px;
  }
</style>
