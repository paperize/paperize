<template lang="pug">
v-layout(row fluid)
  v-flex(xs6)
    .headline Get Started!

    v-btn(color="success") Sign in with Google
  v-flex(xs6)
    .headline What is Paperize?

    p Paperize is the free-as-in-free tabletop game prototyping tool for kids, teachers, facilitators, and game design professionals.

    v-btn(href="https://patreon.com/paperize") Learn More
//- vue-embed(v-if="notInTest" id="gist" :options="{ emoji: true }")
//-   p.gist https://gist.github.com/lorennorman/9d0f3d7df597756a3bc14de4288e7c45.js
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
