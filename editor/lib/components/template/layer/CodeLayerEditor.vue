<template lang="pug">
modal(:name="`Transform ${transform.renderOrder}`" width="95%" height="95%" @opened="enableAceEditor")
  #render-function-editor(ref="renderFunctionEditor") {{ transformRenderFunction }}
  template-preview#side-by-side-preview(:game="activeGame" :component="activeComponent" :item="getComponentItems(activeComponent)[0]")
</template>

<script>
  import { debounce } from 'lodash'
  import { mapGetters } from 'vuex'

  import TemplatePreview from '../template/TemplatePreview.vue'

  export default {
    props: ["transform"],

    components: {
      "template-preview": TemplatePreview
    },

    computed: {
      ...mapGetters(["activeGame", "activeComponent", "getComponentItems"]),

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
    right: 50%;
    bottom: 0;
    left: 0;
  }

  #side-by-side-preview {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 50%;
    width: 50%;
    height: 100%;
  }
</style>
