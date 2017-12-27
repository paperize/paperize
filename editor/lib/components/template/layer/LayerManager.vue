<template lang="pug">
.grid-x
  a.success(@click="addTemplateLayer(template)")
    i.fa.fa-plus

  .small-12.cell
    table(v-if="template")
      draggable(v-model="templateLayers" element="tbody" :options="{ handle: '.drag' }")
        tr(v-for="layer in templateLayers")
          td.drag
            i.fa.fa-bars

          td(v-if="editing != layer")
            a(@click="editing = layer")
              i.fa.fa-pencil
            span(:title="layer.name")  {{ layer.name | truncate }}

          td(v-else)
            input(type="text" ref="editingInput" v-model="layerName" @blur="editing = null")

          td(title="This is a Code Layer")
            i.fa.fa-code

          td
            //- edit code layer
            //- a(@click="$modal.show(`Layer ${layer.renderOrder}`)")
            //-   i.fa.fa-pencil
            //- = " "
            a(@click="confirmDeletion(layer)")
              i.fa.fa-remove
</template>

<script>
  import { mapGetters, mapActions, mapMutations } from 'vuex'

  import draggable from 'vuedraggable'

  export default {
    props: ["template"],

    components: {
      draggable,
    },

    filters: {
      truncate(string) {
        if(string.length > 10) {
          string = `${string.substr(0, 8)}...`
        }
        return string
      }
    },

    data() {
      return {
        editingVar: null
      }
    },

    computed: {
      ...mapGetters(["getTemplateLayers"]),

      editing: {
        get() {
          return this.editingVar
        },

        set(newEditing) {
          if(this.editingVar = newEditing) {
            this.$nextTick(() => {
              this.$refs.editingInput[0].select()
            })
          }
        }
      },

      templateLayers: {
        get() {
          return this.getTemplateLayers(this.template)
        },

        set(newLayers) {
          this.setTemplateLayers({
            template: this.template,
            layers: newLayers
          })
        }
      },

      layerName: {
        get() {
          return this.editing.name
        },

        set(newName) {
          this.updateLayerName({ layer: this.editing, name: newName })
        }
      }
    },

    methods: {
      ...mapActions(["addTemplateLayer", "deleteTemplateLayer", "setTemplateLayers"]),
      ...mapMutations(["updateLayerName"]),

      confirmDeletion(layer) {
        this.$modal.show("dialog", {
          title: `Are you sure you want to delete the layer: "${layer.name}"?`,
          buttons: [
            {
              title: "No",
              default: true
            }, {
              title: "Yes",
              handler: () => {
                this.deleteTemplateLayer({ template: this.template, layer })
                this.$modal.hide("dialog")
              }
            }
          ]
        })
      }
    }
  }
</script>

<style>
  .drag {
    cursor: move;
  }
</style>
