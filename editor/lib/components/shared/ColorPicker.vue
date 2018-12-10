<template lang="pug">
  chrome(:value="value" @input="emitOnlyHex")
</template>

<script>
  import { Chrome } from 'vue-color'

  export default {
    props: ["value"],

    components: { Chrome },

    methods: {
      emitOnlyHex(color) {
        this.$emit("input", color.hex)
      }
    }
  }
</script>
