<template lang="pug">
  v-container#threshold(grid-list-xl fluid)
    v-layout(row fluid wrap justify-space-around)
      v-flex(xs12)
        h1 Data Manager

      v-flex(xs6)
        h2 No Database Selected

        v-btn Save Locally

      v-flex(xs6)
        h2 No User Selected

        log-in-button Save to Google Drive
</template>

<script>
  import LogInButton from './LogInButton.vue'

  export default {
    components: { LogInButton }
  }
</script>
