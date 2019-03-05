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
        .then((imageRecord) => {
          return dispatch("updateImage", {
            ...imageRecord,
            refreshedAt: Date.now()
          })
        })
    }
  }
}

const ImagesModule = generateCrud(ImageModel)

export default ImagesModule
