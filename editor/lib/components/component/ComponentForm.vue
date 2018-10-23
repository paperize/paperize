<template lang="pug">
v-form.component-form(@submit.prevent="$emit('close-dialog')")
  v-card
    v-card-title
      .headline Component: {{ component.title }}

    v-card-text
      v-text-field.component-title(v-model="componentTitle" :rules="[rules.required]" label="Title" placeholder="Artifact Cards")

      template-size-editor(:template="findComponentTemplate(component)")

    v-card-actions
      v-btn(small @click="$emit('close-dialog')") Close
</template>

<script>
  import { mapGetters } from 'vuex'
  import TemplateSizeEditor from '../template/TemplateSizeEditor.vue'

  export default {
    props: {
      component: {
        required: true
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

      componentTitle: {
        get() { return this.component.title },

        set(newTitle) {
          this.$store.dispatch("updateComponent", { ...this.component, ...{ title: newTitle }})
        }
      }
    },
  }
</script>
