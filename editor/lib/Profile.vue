<template>
  <div>
    <span v-bind:class="{ active: authenticated }">{{ profile.name }}</span>
    <img alt="avatar" class="avatar" v-bind:src="profile.avatarSrc" v-bind:class="{ active: authenticated }">
    <button type="submit" v-on:click="login()" v-bind:class="{ active: !authenticated }">Sign In</button>
    <button type="submit" v-on:click="logout()" v-bind:class="{ active: authenticated }">Sign Out</button>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'

  export default {
    computed: mapState(['authenticated', 'profile']),
    methods: { ...mapMutations(['logout']), ...mapActions(['login']) }
  }
</script>

<style>
  .avatar {
    max-width: 40px;
    max-height: 40px;
    border-radius: 50px;
  }

  button {
    cursor: pointer;
  }

  button, .avatar {
    display: none;
  }

  .active {
    display: block;
  }
</style>
