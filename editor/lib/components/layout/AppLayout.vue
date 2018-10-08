<template lang="pug">
v-app
  v-navigation-drawer(app mini-variant)
  v-toolbar(app)

  v-content
    v-container(fluid)
      router-view

  v-footer(app)
</template>
