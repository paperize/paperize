<template lang="pug">
v-form.component-form(ref="componentForm" @submit.prevent="submitComponent")
  v-card
    v-card-title
      .headline New Component

    v-card-text
      v-text-field.component-title(v-model="component.title" :rules="[rules.required]" label="Title" placeholder="Artifact Cards")
      v-checkbox( v-model="createDriveFolder" label="Create a Google Drive Folder for this component?")

    v-card-actions
      v-btn(small success @click="submitComponent") Create Component
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    data() {
      return {
        component: { title: "" },
        createDriveFolder: true,
        rules: {
          required: value => !!value || 'Required.'
        }
      }
    },

    computed: {
      ...mapGetters(["activeGame"]),
    },

    methods: {
      ...mapActions(["createGameComponent", "createComponentFolder", "createComponentImageFolder"]),

      submitComponent() {
        if(this.$refs.componentForm.validate()) {
          const gameAndComponent = { game: this.activeGame, component: this.component }
          let createComponentPromise

          createComponentPromise = this.createGameComponent(gameAndComponent)

          if(this.createDriveFolder) {
            createComponentPromise.then((componentId) => {
              return this.createComponentFolder(componentId)
                .then(() => {
                  return this.createComponentImageFolder(componentId)
                })
            })
          }

          createComponentPromise.then((componentId) => {
            // stop validating this form
            this.$refs.componentForm.reset()
            // reset the title
            this.component.title = ""
            // activate the component we created
            this.$store.dispatch("setActiveComponent", componentId)
          })

          this.$emit("close-dialog")
        }
      }
    }
  }
</script>
