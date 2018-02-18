<template lang="pug">
.grid-x
  .auto.cell
    h5 Layers
  .shrink.cell
    a.button.tiny.success(@click="selectNewLayerType()")
      i.fas.fa-plus
      |  New Layer


  .small-12.cell
    table
      draggable(v-model="templateLayers" element="tbody" :options="{ handle: '.drag' }")
        tr.layer(v-for="layer in templateLayers" @click="setActiveLayer({ layer })" :class="{ 'active-layer': isActive(layer) }")
          td.grid-x.grid-padding-x
            .shrink.cell.drag
              i.fas.fa-bars

              = " "

              i.fas.fa-code(v-if="layer.type == 'code'" title="This is a Code Layer")
              i.fas.fa-font(v-else-if="layer.type == 'text'" title="This is a Text Layer")
              i.far.fa-square(v-else-if="layer.type == 'shape'" title="This is a Shape Layer")
              i.fas.fa-image(v-else-if="layer.type == 'image'" title="This is an Image Layer")

            .auto.cell
              span(:title="layer.name")  {{ layer.name | truncate }}

            .shrink.cell
              a(@click="confirmDeletion(layer)")
                i.fas.fa-times
</template>

<script>
  import { mapGetters, mapActions, mapMutations } from 'vuex'

  import draggable from 'vuedraggable'

  export default {
    props: ["template"],

    components: { draggable },

    filters: {
      truncate(string) {
        if(string.length > 20) {
          string = `${string.substr(0, 18)}...`
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
      ...mapGetters(["findAllTemplateLayers", "activeLayer"]),

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
          return this.findAllTemplateLayers(this.template) || []
        },

        set(newLayers) {
          this.setLayersRenderOrder(newLayers)
        }
      }
    },

    methods: {
      ...mapActions(["createTemplateLayer", "destroyTemplateLayer", "setLayersRenderOrder"]),
      ...mapMutations(["setActiveLayer"]),

      isActive(layer) {
        return this.activeLayer === layer
      },

      selectNewLayerType() {
        const handlerFunction = (layerType) => {
          return () => {
            this.createTemplateLayer({ template: this.template, layerType })
            this.$modal.hide("dialog")
          }
        }

        this.$modal.show('dialog', {
          title: "Add what type of Layer?",
          buttons: [
            {
              title: "Cancel",
              default: true
            }, {
              title: "Text",
              handler: handlerFunction("text")
            }, {
              title: "Image",
              handler: handlerFunction("image")
            }, {
              title: "Shape",
              handler: handlerFunction("shape")
            }, {
              title: "Code",
              handler: handlerFunction("code")
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
                this.destroyTemplateLayer({ template: this.template, layer })
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

  .layer:hover {
    background-color: lightgray;
  }

  .active-layer {
    font-size: 1.25em;
    font-weight: bold;
  }

  .active-layer .drag {
    color: initial;
  }
</style>
