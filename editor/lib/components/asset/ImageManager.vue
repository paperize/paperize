<template lang="pug">
modal.image-manager(name="Image Library" height="auto" :pivotY="0.25" :scrollable="true")
  h1 Image Library
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    computed: mapState(['imageLibraryOpen']),

    watch: {
      imageLibraryOpen() {
        if(this.imageLibraryOpen){
          this.$modal.show("Image Library")
        } else {
          this.$modal.hide("Image Library")
        }
      }
    }
  }
</script>
