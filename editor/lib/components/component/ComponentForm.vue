<template lang="pug">
v-form.component-form(ref="componentForm" @submit.prevent="submitComponent")
  v-card
    v-card-title
      .headline Component: {{ component.title }}

    v-card-text
      v-text-field.component-title(v-model="title" :rules="[rules.required]" label="Title" placeholder="Artifact Cards")
      v-checkbox(v-if="!isSaved" v-model="createDriveFolder" label="Create a Google Drive Folder for this component?")
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
        createDriveFolder: true,
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
      ...mapActions(["createGameComponent", "createGameComponentAndDriveFolder", "updateComponent"]),

      submitComponent() {
        if(this.$refs.componentForm.validate()) {
          if(!this.isSaved) {
            const gameAndComponent = { game: this.activeGame, component: { title: this.component.title } }
            let createPromise

            if(this.createDriveFolder) {
              createPromise = this.createGameComponentAndDriveFolder(gameAndComponent)
            } else {
              createPromise = this.createGameComponent(gameAndComponent)
            }

            createPromise.then((componentId) => {
              this.$store.dispatch("setActiveComponent", componentId)
            })
          }

          this.$emit("close-dialog")
        }
      }
    }
  }
</script>
