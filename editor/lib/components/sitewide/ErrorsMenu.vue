<template lang="pug">
v-btn(flat @click="showErrorExplorer = true") Errors
  v-dialog.errors-explorer(v-model="showErrorExplorer" @close-dialog="showErrorExplorer = false" max-width="500" lazy)
    h1 Errors Explorer
</template>

<script>
  export default {
    data() {
      return {
        showErrorExplorer: false
      }
    }
  }
</script>
