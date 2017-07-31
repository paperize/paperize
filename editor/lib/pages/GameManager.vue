<template lang="pug">
div(v-if="!authenticated")
  p
    | You are not logged in.
    a(v-on:click="login") Click here to log in now.

div(v-else)
  h2 Game Manager
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  export default {
    computed: {
      ...mapState(["authenticated"])
    },
    methods: {
      ...mapActions(["login"])
    },
    components: { }
  }

</script>
