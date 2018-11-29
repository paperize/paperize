import { omit } from 'lodash'
import { drive } from "../services/google"

const DatabaseModule = {
  state: {
    workingDirectory: {
      id: null,
      name: null
    },
    databaseFile: {
      id: null,
      name: null
    },
  },

  getters: {
    workingDirectory: (state, getters) => { return { ...state.workingDirectory, url: getters.workingDirectoryUrl } },
    workingDirectoryId: state => state.workingDirectory.id,
    workingDirectoryName: state => state.workingDirectory.name,
    workingDirectoryUrl: (state, getters) => getters.driveUrl(state.workingDirectory.id),
    databaseFile: (state, getters) => { return { ...state.databaseFile, url: getters.databaseFileUrl } },
    databaseFileId: state => state.databaseFile.id,
    databaseFileName: state => state.databaseFile.name,
    databaseFileUrl: (state, getters) => getters.driveUrl(state.databaseFile.id),
    driveUrl: () => driveId => `https://drive.google.com/file/d/${driveId}/edit?usp=sharing`,

    databaseState: (_, __, rootState) => {
      return omit(rootState, ["user", "database", "ui"])
    }
  },

  mutations: {
    setWorkingDirectory(state, { id, name }) {
      state.workingDirectory.id = id
      state.workingDirectory.name = name
    },

    setDatabaseFile(state, { id, name }) {
      state.databaseFile.id = id
      state.databaseFile.name = name
    },
  },

  actions: {
    saveToDrive({ commit, getters }) {
      commit("setSaving", true)
      return drive.updateFile(getters.databaseFileId, getters.databaseState)
        .finally(() => {
          commit("setSaving", false)
        })
    }
  }
}

export default DatabaseModule
