<template lang="pug">
#transform-manager
  .grid-x
    .small-10.cell
      h5.truncate Transforms

    .small-2.cell
      a.success(@click="addTransform(component)")
        i.fa.fa-plus

    .small-12.cell
      table(v-if="component")
        draggable(v-model="componentTransforms" element="tbody" :options="{ handle: '.drag' }")
          tr(v-for="transform in componentTransforms")
            td.drag
              i.fa.fa-bars

            td(v-if="editing != transform")
              a(@click="editing = transform")
                i.fa.fa-pencil
              span(:title="transform.name")  {{ transform.name | truncate }}

            td(v-else)
              input(type="text" ref="editingInput" v-model="transformName" @blur="editing = null")

            td(title="This is a Code Transform")
              i.fa.fa-code

            td
              a(@click="$modal.show(`Transform ${transform.renderOrder}`)")
                i.fa.fa-pencil
              = " "
              a(@click="deleteTransform({ component, transform })")
                i.fa.fa-remove

              transform-editor(:transform="transform")
      p(v-else) Select a Source...
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  import draggable from 'vuedraggable'
  import TransformEditor from './TransformEditor.vue'

  export default {
    props: ["component"],

    components: {
      draggable,
      "transform-editor": TransformEditor
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

      componentTransforms: {
        get() {
          return this.$store.getters.getComponentTransforms(this.component)
        },

        set(newTransforms) {
          this.$store.commit("setComponentTransforms", {
            component: this.component,
            transforms: newTransforms
          })
        }
      },

      transformName: {
        get() {
          return this.editing.name
        },

        set(newName) {
          this.$store.commit("updateTransformName", { transform: this.editing, name: newName })
        }
      }
    },

    methods: mapActions(["addTransform", "deleteTransform"])
  }
</script>

<style>
  .drag {
    cursor: move;
  }
</style>
