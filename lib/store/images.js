import { pick } from 'lodash'
import { generateCrud } from './util/vuex_resource'

const ImageModel = {
  name: 'images',

  create(newImage) {
    return {
      ...pick(newImage, [
        "id",
        "name",
        "md5",
        "mimeType",
        "parents"
      ]),

      refreshedAt: Date.now()
    }
  },

  getters: { },

  mutations: { },

  actions: {
    refreshImageRecord({ dispatch }, imageId) {
      return dispatch("googleGetRecord", imageId)

        // Found it, update our record
        .then((imageRecord) => {
          return dispatch("updateImage", {
            ...imageRecord,
            refreshedAt: Date.now()
          })
        })

        // Didn't find it, destroy our record
        .catch({ message: `File not found: ${imageId}.`}, () => {
          return dispatch("destroyImage", { id: imageId })
        })
    }
  }
}

const ImagesModule = generateCrud(ImageModel)

export default ImagesModule
