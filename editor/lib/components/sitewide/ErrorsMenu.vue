<template lang="pug">
v-btn(v-if="anyErrors" flat @click="showErrorExplorer = true")
  v-badge.error-count(color="red")
    | Errors

    template(slot="badge")
      span {{ errorCount }}

  v-dialog.errors-explorer(v-model="showErrorExplorer" @close-dialog="showErrorExplorer = false" max-width="500" lazy)
    v-card
      v-card-title Recent Errors
      v-card-text
        v-expansion-panel#errors-explorer(popout)
          v-expansion-panel-content(v-for="error in allErrors")
            div(slot="header") {{ error.name }}
            v-card
              v-card-text
                .message {{ error.message }}
                .details {{ error.details }}
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    data() {
      return {
        showErrorExplorer: false
      }
    },

    computed: {
      ...mapGetters(["allErrors"]),

      errorCount() { return this.allErrors.length },

      anyErrors() { return this.errorCount > 0 },
    }
  }
</script>

<style>
.error-count .v-badge__badge {
  font-size: 11px !important;
  width: 18px !important;
  height: 18px !important;
  right: -14px !important;
  top: -9px !important;
}
</style>
