# Paperize Documentation

A static site created with [Gridsome](https://gridsome.org)

# Known Issues

- unable to use `<g-link>` tags: they fail in production. seems to be the use of `<g-image>` actually?
- unable to use `<v-tile-group>` tags: the `<template v-slot:activator>` throws "Cannot read property $scopedSlots of undefined". seems to be slots
