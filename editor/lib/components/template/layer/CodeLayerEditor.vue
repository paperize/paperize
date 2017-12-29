<template lang="pug">
.code-layer-editor
  #render-function-editor(ref="renderFunctionEditor") {{ layerRenderFunction }}
</template>

<script>
  import { debounce } from 'lodash'
  import { mapGetters } from 'vuex'

  export default {
    props: ["layer"],

    updated() {
      this.enableAceEditor()
    },

    mounted() {
      this.enableAceEditor()
    },

    computed: {
      ...mapGetters(["activeGame", "activeComponent", "getComponentItems"]),

      layerRenderFunction: {
        get() { return this.layer.renderFunction },

        set: debounce(function(newRenderFunction) {
          this.$store.dispatch('setLayerRenderFunction', { layer: this.layer, renderFunction: newRenderFunction })
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
            this.layerRenderFunction = editor.getValue()
          })
        }, 100)
      }
    }
  }
</script>

<style scoped>
  .code-layer-editor {
    position: relative;
    width: 100%;
    height: 100%;
  }

  #render-function-editor {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
