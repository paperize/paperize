<template lang="pug">
v-card.image-manager
  v-card-title
    .headline Image Library

  v-card-text(v-if="showImageSpinner")
    v-progress-circular(indeterminate color="primary")
    p Importing images...

  v-card-text(v-else)
    input(id="image-files-input" type="file" multiple @change="handleFileInput")

    v-data-table.elevation-1(:items="images")
      template(slot="items" slot-scope="props")
        td(v-if="editing == props.item.id")
          v-btn(small @click="stopEditing") Accept

        td(v-else)
          v-btn(small @click="showDeleteImageDialogFor(props.item)")
            v-icon delete
          v-btn(small @click="editImage(props.item)")
            v-icon edit

        td(v-if="editing == props.item.id")
          inline-image-editor(:image="props.item" @next="editNextImage(true)" @previous="editNextImage(false)")

        td(v-else)
          a(:title="props.item.id" @click="editImage(props.item)")  {{ props.item.name }}

        td.preview
          local-image(:imageId="props.item.id")

    v-dialog(v-model="showDeleteImageDialog" max-width="500" lazy)
      v-card
        v-card-title
          .headline Are you sure you want to delete the image "{{ imageToDelete.name }}"?
        v-card-actions
          v-btn(@click="showDeleteImageDialog = false") No
          v-btn(@click="destroyImage()") Yes

    input(id="image-files-input" type="file" multiple @change="handleFileInput")
</template>

<script>
  import { find, findIndex } from 'lodash'

  import InlineImageEditor from './InlineImageEditor.vue'
  import LocalImage from './LocalImage.vue'

  export default {
    components: { InlineImageEditor, LocalImage },

    data() {
      return {
        showImageSpinner: false,
        showDeleteImageDialog: false,
        imageToDelete: {},
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

      showDeleteImageDialogFor(image) {
        this.imageToDelete = image
        this.showDeleteImageDialog = true
      },

      destroyImage() {
        this.deleteImage({ image: this.imageToDelete })
        this.showDeleteImageDialog = false
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
