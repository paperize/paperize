<template lang="pug">
v-tooltip(v-if="imageId" top)
  a(slot="activator" :href="driveLink" target="_blank")
    v-icon mdi-image
  p {{ imageId }}
  span An image on Google Drive
</template>

<script>
  export default {
    props: ["imageId"],

    computed: {
      driveLink() {
        return `https://drive.google.com/open?id=${this.imageId}`
      }
    }
  }
</script>

<style scoped>
  a {
    text-decoration: none;
  }
</style>
