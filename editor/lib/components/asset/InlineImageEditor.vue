<template lang="pug">
  input(v-model="imageName" type="text" @keydown.shift.tab.stop.prevent="$emit('previous')" @keydown.tab.exact.stop.prevent="$emit('next')")
</template>

<script>
  export default {
    props: ["image"],

    mounted() { this.$el.select() },

    computed: {
      imageName: {
        get() { return this.image.name },

        set(newName) {
          this.$store.commit('updateImageName', { image: this.image, name: newName })
        }
      }
    }
  }
</script>
