<template lang="pug">
v-menu
  v-btn(flat slot="activator") Help

  v-list
    v-list-tile(href="https://docs.paperize.io" target="_blank")
      v-list-tile-title Documentation

    v-list-tile(href="https://discord.gg/9ggkkQp" target="_blank")
      v-list-tile-title Join Discord

    v-list-tile(:href="bugLink" title="Send a bug report email")
      v-list-tile-title Report a Bug

    v-list-tile(:href="featureLink" title="Send a feature request email")
      v-list-tile-title Request a Feature
</template>

<script>
  export default {
    computed: {
      bugLink() {
        const
          email = "loren+bugs@oilandrope.com",
          subject = "subject=Paperize.io Bug Report",
          body = `body=A good bug report contains 3 things: what I DID, what I EXPECTED to happen, and what ACTUALLY happened...`,
          params = [subject, body].join('&')

        return `mailto:${email}?${params}`
      },

      featureLink() {
        const
          email = "loren+features@oilandrope.com",
          subject = "subject=Paperize.io Feature Request",
          body = "body=Paperize would be even better if it...",
          params = [subject, body].join('&')

        return `mailto:${email}?${params}`
      },
    }
  }
</script>
