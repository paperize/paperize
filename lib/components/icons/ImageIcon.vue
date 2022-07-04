<template lang="pug">
v-tooltip(v-if="imageId" top)
  | Drive Image: {{ (image && image.name) || imageId || "No Image ID" }}

  template(v-slot:activator="{ on }")
    a(v-on="on" :href="driveLink" target="_blank")
      v-icon mdi-image
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    props: ["imageId"],

    computed: {
      ...mapGetters(["findImage"]),

      image() {
        return this.imageId && this.findImage(this.imageId, false)
      },

      driveLink() {
        if(this.image) {
          return `https://drive.google.com/open?id=${this.imageId}`
        }
      }
    }
  }
</script>

<style scoped>
  a {
    text-decoration: none;
  }

  a:hover i {
    color: rgb(212, 42, 33);
  }
</style>
