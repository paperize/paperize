<template lang="pug">
form(@submit.stop.prevent="$emit('next')")
  input(v-model="imageName" ref="nameInput" type="text" @keydown.shift.tab.stop.prevent="$emit('previous')" @keydown.tab.exact.stop.prevent="$emit('next')")
</template>

<script>
  export default {
    props: ["image"],

    mounted() { this.$refs.nameInput.select() },

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
