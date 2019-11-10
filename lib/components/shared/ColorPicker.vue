<template lang="pug">
  div(v-observe-visibility="visibilityChanged")
    v-label(v-if="label") {{ label }}

    chrome(v-if="showPicker" :value="value" @input="emitOnlyHex")
    div.color-swatch(v-else @click="showPicker = true" :style="{ backgroundColor: value }")
</template>

<script>
  import { Chrome } from 'vue-color'

  export default {
    props: ["value", "label"],

    data() {
      return {
        showPicker: false
      }
    },

    components: { Chrome },

    methods: {
      emitOnlyHex(color) {
        this.$emit("input", color.hex)
      },

      visibilityChanged(visible) {
        if(!visible) {
          this.showPicker = false
        }
      }
    }
  }
</script>

<style>
  .color-swatch {
    width: 50px;
    height: 50px;
    cursor: pointer;
  }
</style>
