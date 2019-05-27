<template lang="pug">
v-btn(v-if="anyErrors" flat @click="showErrorExplorer = true")
  v-badge.error-count(color="red")
    | Errors

    template(slot="badge")
      span {{ errorCount }}

  v-dialog.errors-explorer(v-model="showErrorExplorer" @close-dialog="showErrorExplorer = false" max-width="500" lazy)
    h1 Errors Explorer
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
