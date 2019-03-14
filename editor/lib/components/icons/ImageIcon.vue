<template lang="pug">
  v-tooltip(v-if="imageId" top)
    | {{ imageId }}

    a(slot="activator" :href="driveLink" target="_blank")
      v-icon mdi-image
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
