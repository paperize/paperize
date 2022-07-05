<template lang="pug">
v-container(grid-list-xl fluid)
  v-layout(fluid wrap justify-space-around)
    v-flex(sm8 md4)
      p.display-1.text-center Get Involved!

      p.headline.text-center Patreon

      p.body-2 Paperize is supported in part with generous contributions from people like you!

      p.body-2
        a(href="https://www.patreon.com/bePatron?u=67763" data-patreon-widget-type="become-patron-button")
          v-img(:src="becomeAPatron" contain max-height="51")

      p.headline.text-center Discord

      p.body-2 The Paperize community is growing. You can join us on the Paperize.io Discord server to get help, give feedback, request features, and design games together with other Paperize users.

      v-layout(justify-space-around)
        v-flex(xs10)
          iframe(v-if="!isCypress" src="https://discordapp.com/widget?id=335061144311955456&theme=dark" width="100%" height="500" allowtransparency="true" frameborder="0")

    v-flex(sm8 md4)
      p.display-1.text-center What is Paperize.io?

      p.headline.text-center Paperize is a Paper Prototyping Tool

      p.body-2 With Paperize, your ideas get out of your head and onto the tabletop, <em>fast</em>.

      p.body-2 Demo coming soon.

      p.headline.text-center Paperize is Free (as in Free)

      p.body-2 Paperize is "free as in pizza", which means "you can have this piece of software to use as you wish."

      p.body-2 Paperize is "free as in speech", which means "you can inspect, modify, and distribute the source code of this software."

      p.body-2 Paperize is "free from surveillance", which means it doesn't track you around the web, or access the data you trust it with.

      p.body-2 Paperize is "free from ads", which means it's clean to look at and a pleasure to use.

    v-flex(sm8 md4)
      p.display-1.text-center Get Started!

      p.body-2 You only need a Google account to log in and get started creating games right away! Just click "Sign In" above and to the right.
</template>

<script>
  import { mapGetters } from 'vuex'
  import becomeAPatron from "/images/become_a_patron_button@2x.png"

  export default {
    data() {
      return { becomeAPatron }
    },
    computed: mapGetters([ "isCypress" ])
  }
</script>
