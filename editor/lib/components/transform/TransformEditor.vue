<template lang="pug">
modal(:name="`Transform ${transform.renderOrder}`" width="60%" height="80%" @opened="enableAceEditor")
  .grid-x.grid-padding-x
    .small-12.cell
      h2 Editing Transform {{ transform.renderOrder }}

      label(for="render-function-editor") Render Function
      #render-function-editor(ref="renderFunctionEditor") {{ transformRenderFunction }}

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
    },

    methods: {
      enableAceEditor() {
        setTimeout(() => {
          let editorEl = this.$refs["renderFunctionEditor"]
          ace.config.set('basePath', '/js/vendor');
          let editor = ace.edit(editorEl)
          editor.setTheme("ace/theme/pastel_on_dark")
          editor.getSession().setMode("ace/mode/javascript")
          editor.getSession().on('change', (e) => {
            this.transformRenderFunction = editor.getValue()
          })
        }, 100)
      }
    }
  }
</script>

<style scoped>
  #render-function-editor {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  /*textarea {
    font-family: monospace;
    height: 100%;
  }*/
</style>
