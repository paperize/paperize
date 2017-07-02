<template>
  <div>
    <!-- <span>{{ user.name | capitalize }}</span> -->
    <img alt="avatar" class="avatar" v-bind:src="user.avatarSrc" v-bind:class="{ active: user.authenticated }">
    <button type="submit" v-on:click="login()" v-bind:class="{ active: !user.authenticated }">Sign In</button>
    <button type="submit" v-on:click="logout()" v-bind:class="{ active: user.authenticated }">Sign Out</button>
  </div>
</template>

<script>
  import auth from "./auth.js"

  let user = {
    authenticated: false,
    name: ''
  }

  auth.whenProfileIsSet((profile) => {
    user.authenticated = true
    user.name          = profile.nickname
    user.avatarSrc     = profile.picture
  })

  let logout = () => {
    auth.logout()
    user.authenticated = false
    user.name = ''
    user.avatarSrc = null
    window.location.href = "/"
  }

  export default {
    data: () => {
      return {
        login: auth.promptForLogin,
        user,
        logout
      }
    },
    filters: {
      capitalize: function (value) {
        if (!value) return ''
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
    }
  }
</script>

<style>
  .avatar {
    max-width: 40px;
    max-height: 40px;
    border-radius: 50px;
  }

  button, .avatar {
    display: none;
  }

  .active {
    display: block;
  }
</style>
