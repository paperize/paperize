<template lang="pug">
.grid-x
  .auto.cell
    h5 Layers
  .shrink.cell
    a.button.tiny.success(@click="selectNewLayerType()")
      i.fa.fa-plus
      |  New Layer


  .small-12.cell
    table
      draggable(v-model="templateLayers" element="tbody" :options="{ handle: '.drag' }")
        tr.layer(v-for="layer in templateLayers" @click="setActiveLayer({ layer })")
          td.grid-x.grid-padding-x
            .shrink.cell.drag
              i.fa.fa-bars

              = " "

              i.fa.fa-code(v-if="layer.type == 'code'" title="This is a Code Layer")
              i.fa.fa-font(v-else-if="layer.type == 'text'" title="This is a Text Layer")
              i.fa.fa-circle(v-else-if="layer.type == 'shape'" title="This is a Shape Layer")
              i.fa.fa-image(v-else-if="layer.type == 'image'" title="This is an Image Layer")
            //- .shrink.cell

            .auto.cell
              span(:title="layer.name")  {{ layer.name | truncate }}


            .shrink.cell
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

    components: { draggable },

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
      ...mapGetters(["getTemplateLayers", "getActiveLayer"]),

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
      ...mapMutations(["updateLayerName", "setActiveLayer"]),

      selectNewLayerType() {
        this.$modal.show('dialog', {
          title: "Add what type of Layer?",
          buttons: [
            {
              title: "Cancel",
              default: true
            }, {
              title: "Text",
              handler: () => {
                this.addTemplateLayer({ template: this.template, layerType: "text" })
                this.$modal.hide("dialog")
              }
            }, {
              title: "Image",
              handler: () => {
                this.addTemplateLayer({ template: this.template, layerType: "image" })
                this.$modal.hide("dialog")
              }
            }, {
              title: "Shape",
              handler: () => {
                this.addTemplateLayer({ template: this.template, layerType: "shape" })
                this.$modal.hide("dialog")
              }
            }, {
              title: "Code",
              handler: () => {
                this.addTemplateLayer({ template: this.template, layerType: "code" })
                this.$modal.hide("dialog")
              }
            }
          ]
        })

      },

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
    color: gray;
    cursor: move;
  }

  .layer {
    cursor: pointer;
  }
</style>
