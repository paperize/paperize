import persistence from '../store/pouch_persistence'

const api = {
  getImage(imageId) {
    return persistence.db.get(imageId)
  },

  putImage(imageAsset) {
    return persistence.db.put(imageAsset)
  }
}

export default api
