<template lang="pug">
modal.image-manager(name="Image Library" height="auto" :pivotY="0.25" :scrollable="true")
  .grid-x.grid-padding-x
    .small-12.cell
      h1 Image Library

    .small-12.cell
      input(id="image-files-input" type="file" multiple @change="handleFiles")

      ul
        li(v-for="image in images")
          a(:title="image.id" @click="preview(image)") {{ image.name }}

      img(v-if="previewImage" :src="previewImage")

      input(id="image-files-input" type="file" multiple @change="handleFiles")
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

      getFiles() {
        return $('#image-files-input')[0].files
      },

      handleFiles() {
        let files = this.getFiles()

        this.$store.dispatch('importImageFiles', files)
      }
    }
  }
</script>
