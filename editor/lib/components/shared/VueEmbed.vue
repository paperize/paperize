<template lang="pug">
div(:id="id")
  slot
</template>

<script>
  // This lets me embed a Gist from Github into a component
  // Modified from: https://github.com/Gomah/vue-embed
  import EmbedJS from 'embed-js';

  export default {
    props: {
      id: {
        type: String,
        default: 'embed__container',
      },
      options: {
        type: Object,
        default: () => ({}),
      },
    },

    data() {
      return {
        vEmbed: {},
      };
    },

    mounted() {
      EmbedJS.setOptions(this.options);

      this.vEmbed = new EmbedJS({
        input: document.querySelector(`#${this.id}`),
      });

      this.vEmbed.render();
    },

    beforeDestroy() {
      this.vEmbed.destroy();
    },
  };
</script>
