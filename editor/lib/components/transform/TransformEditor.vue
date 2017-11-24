<template lang="pug">
modal(:name="`Transform ${transform.renderOrder}`" width="60%" height="80%")
  .grid-x.grid-padding-x
    .small-12.cell
      h2 Editing Transform {{ transform.renderOrder }}

      label(for="render-function-editor") Render Function
      textarea(id="render-function-editor" v-model="transformRenderFunction")

      a.button.small(@click="updateTransform()") Update Transform
</template>

<script>
  import { debounce } from 'lodash'

  export default {
    props: ["transform"],

    computed: {
      transformRenderFunction: {
        get() { return this.transform.renderFunction },

        set: debounce(function(newRenderFunction) {
          this.$store.dispatch('updateTransformRenderFunction', { transform: this.transform, renderFunction: newRenderFunction })
        }, 1000)
      }
    }
  }
</script>

<style scoped>
  textarea {
    font-family: monospace;
    height: 100%;
  }
</style>
