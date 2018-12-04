<template lang="pug">
v-form.component-form(ref="componentForm" @submit.prevent="submitComponent")
  v-card
    v-card-title
      .headline Component: {{ component.title }}

    v-card-text
      v-text-field.component-title(v-model="title" :rules="[rules.required]" label="Title" placeholder="Artifact Cards")

      template-size-editor(v-if="isSaved" :template="findComponentTemplate(component)")

    v-card-actions
      v-btn(small success @click="submitComponent") {{ submitButtonText }}
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { computedVModelUpdate } from '../util/component_helper'
  import TemplateSizeEditor from '../template/TemplateSizeEditor.vue'

  const getSet = computedVModelUpdate("component", "updateComponent", "title"),
    savedTitleGet = getSet.get,
    savedTitleSet = getSet.set

  export default {
    props: {
      component: {
        default() { return {} }
      }
    },

    components: { TemplateSizeEditor },

    data() {
      return {
        rules: {
          required: value => !!value || 'Required.'
        }
      }
    },

    computed: {
      ...mapGetters(["activeGame", "findComponentTemplate"]),

      title: {
        get() {
          if(this.isSaved) { return savedTitleGet.call(this) }
          else { this.component.title }
        },

        set(newTitle) {
          if(this.isSaved) { return savedTitleSet.call(this, newTitle) }
          else { this.component.title = newTitle }
        }
      },

      isSaved() { return !!this.component.id },

      submitButtonText() { return this.isSaved ? "Done" : "Create Component" },
    },

    methods: {
      ...mapActions(["createGameComponent", "updateComponent"]),

      submitComponent() {
        if(this.$refs.componentForm.validate()) {
          if(!this.isSaved) {
            this.createGameComponent({ game: this.activeGame, component: { title: this.component.title } })
            .then((componentId) => {
              this.$store.dispatch("setActiveComponent", componentId)
            })
          }

          this.$emit("close-dialog")
        }
      }
    }
  }
</script>
