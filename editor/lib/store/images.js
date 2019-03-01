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

  actions: { }
}

const ImagesModule = generateCrud(ImageModel)

export default ImagesModule
