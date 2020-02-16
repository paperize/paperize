<template lang="pug">
v-form.component-form(ref="componentForm" @submit.prevent="submitComponent")
  v-card
    v-card-title
      .headline Component: {{ component.title }}

    v-card-text
      v-text-field.component-title(v-model="title" :rules="[rules.required]" label="Title" placeholder="Artifact Cards")
      template-size-editor(:template="findComponentTemplate(component)")

    v-card-actions
      v-btn(small success @click="submitComponent") Done
</template>

<script>
  import { computedVModelUpdate } from '../util/component_helper'
  import TemplateSizeEditor from '../template/TemplateSizeEditor.vue'

  export default {
    props: {
      component: { required: true }
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

      title: computedVModelUpdate("component", "patchComponent", "title"),
    },

    methods: {
      ...mapActions(["patchComponent"]),

      submitComponent() {
        if(this.$refs.componentForm.validate()) {
          this.$emit("close-dialog")
        }
      }
    }
  }
</script>
