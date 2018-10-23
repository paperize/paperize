<template lang="pug">
div
  v-container(fluid)
    v-layout(row wrap)
      v-flex(xs12 md5)
        v-layout(column)
          v-flex
            .headline Benefits
            hr

            .body-1 All about benefits

          v-flex
            .headline Benefits
            hr

            .body-1 All about benefits

          v-flex
            .headline Benefits
            hr

            .body-1 All about benefits

      v-spacer()

      v-flex(xs12 md6 elevation-2 @click="getStarted")
        v-layout(column)
          v-flex
            .headline Get Started
          v-flex
            .body-2 Getting started is really wonderful and you should totally today!

            v-btn(color="success") Get Started

  v-container(fluid grid-list-lg)
    v-layout(row wrap)
      v-flex(xs12 md4)
        .headline About the Project
        hr

        vue-embed(v-if="notInTest" id="gist" :options="{ emoji: true }")
          p.gist https://gist.github.com/lorennorman/9d0f3d7df597756a3bc14de4288e7c45.js

      v-flex(sm12 md4)
        .headline Free as in Free
        hr

      v-flex(sm12 md4)
        .headline Community Driven
        hr
</template>

<script>
  import VueEmbed from './shared/VueEmbed.vue'

  export default {
    computed: {
      notInTest: () => false // process.env.NODE_ENV !== 'test'
    },

    components: { VueEmbed },

    methods: {
      getStarted() {

      }
    }
  }
</script>

<style>
  .gist {
    display: none;
  }
</style>
