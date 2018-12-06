<template lang="pug">
v-form(@submit.stop.prevent="$emit('next')")
  v-text-field(v-model="imageName" autofocus type="text" @keydown.shift.tab.stop.prevent="$emit('previous')" @keydown.tab.exact.stop.prevent="$emit('next')")
</template>

<script>
  export default {
    props: ["image"],

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
