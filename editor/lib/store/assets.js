import { chain } from 'lodash'
import Promise from 'bluebird'
import md5 from 'md5'
import assetStore from '../services/asset_store'

const getFileReader = function() {
  if(process.env.NODE_ENV == 'test' && typeof FileReader == 'undefined') {
    return new (require('file-api').FileReader)()
  } else {
    return new FileReader()
  }
}

const IMAGE_MIME_CHECK = /^image\//

const AssetsModule = {
  state: {
    images: []
  },

  getters: {
    images: state => state.images
  },

  mutations: {
    addImageReference(state, image) {
      state.images.push(image)
    }
  },

  actions: {
    importImageFiles({ commit }, files) {
      let promises = chain(files)
        .filter(file => IMAGE_MIME_CHECK.test(file.type))
        .map(file => {
          return new Promise((resolve, reject) => {
            let reader = getFileReader()
            reader.onload = function(e) {
              resolve({
                _id:  md5(e.target.result),
                name: file.name,
                data: e.target.result
              })
            }
            reader.readAsDataURL(file)
          })

          .then((asset) => {
            return assetStore.putImage(asset)

            .then((response) => {
              commit('addImageReference', { name: asset.name, id: asset._id })
              return asset
            })
          })
        })
      .value()

      return Promise.all(promises)
    }
  }
}

export default AssetsModule
