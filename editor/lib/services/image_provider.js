import store from '../store'

import { get, set } from 'idb-keyval'

const
  getCachedImage = function(key) {
    return get(key)
  },

  setCachedImage = function(key, value) {
    return set(key, value)
  }

const getImageById = function(imageId) {
  return new Promise((resolve, reject) => {
    // lookup image in index
    const imageRecord = store.getters.findImage(imageId)

    if(imageRecord) {
      resolve(imageRecord)
    } else {
      reject(new Error(`No image in index with ${imageId}`))
    }
  }).then(getImageByRecord)
}

const getImageByRecord = function({ id, md5, mimeType }) {
  return new Promise((resolve) => {
    return getCachedImage(md5)
      .then((imageDataURL) => {
        if(imageDataURL) {
          resolve(imageDataURL)
        } else {
          return store.dispatch("googleDownloadFile", id).then((imageData) => {
            const dataURL = `data:${mimeType};base64,${btoa(imageData)}`
            return setCachedImage(md5, dataURL)
              .then(() => { resolve(dataURL) })
          })
        }
      })
  }).then(getImageWithSrc)
}

const getImageByName = function(name) {
  return Promise.try(() => {
    const imageRecord = store.getters.searchImages({ name })[0]

    if(!imageRecord) {
      throw new Error(`No image found with name: ${name}`)
    }

    return getImageByRecord(imageRecord)
  })
}

const getImageWithSrc = function(imageSource) {
  return new Promise((resolve) => {
    const image = new Image()
    image.onload = function() {
      resolve(image)
    }
    image.src = imageSource
  })
}

export { getImageById, getImageByName }
