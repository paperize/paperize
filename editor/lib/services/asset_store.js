
import persistence from '../store/pouch_persistence'

const api = {
  getImage(imageId) {
    return Promise.try(() => { return persistence.db.get(imageId) })
  },

  putImage(imageAsset) {
    return Promise.try(() => {
      return persistence.db.put(imageAsset)
    })
  }
}

export default api
