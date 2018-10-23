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
          v-btn(small @click="confirmDeletion(image)")
            v-icon delete
          v-btn(small @click="editImage(image)")
            v-icon edit

        td(v-if="editing == props.item.id")
          inline-image-editor(:image="image" @next="editNextImage(true)" @previous="editNextImage(false)")

        td(v-else)
          a(:title="props.item.id" @click="editImage(image)")  {{ props.item.name }}

        td.preview
          local-image(:imageId="props.item.id")

    input(id="image-files-input" type="file" multiple @change="handleFileInput")
</template>

<script>
  import { find, findIndex } from 'lodash'
  import { mapGetters, mapActions } from 'vuex'

  import InlineImageEditor from './InlineImageEditor.vue'
  import LocalImage from './LocalImage.vue'

  export default {
    components: { InlineImageEditor, LocalImage },

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
