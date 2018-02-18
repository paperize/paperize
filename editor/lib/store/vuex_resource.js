import { camelCase, filter, find, isString, isNumber, isObject } from 'lodash'
import Vue from 'vue'

export function generateCrud(model) {

  // NAMING THINGS
  const modelRepoName = model.name
  const findModelName = camelCase(`find ${model.name}`)
  const searchModelName = camelCase(`search ${model.name}`)
  const createModelName = camelCase(`create ${model.name}`)
  const updateModelName = camelCase(`update ${model.name}`)
  const destroyModelName = camelCase(`destroy ${model.name}`)


  // STATE (MODEL REPOSITORY)
  const state = {}
  state[modelRepoName] = {}


  // GETTERS
  const getters = {}

  getters[findModelName] = state => modelQuery => {
    if(!isString(modelQuery) && !isNumber(modelQuery)) {
      throw new Error(`ID format not recognized: ${modelQuery}, pass a string or number!`)

    } else {
      let foundModel = state[modelRepoName][modelQuery]

      if(!foundModel) {
        throw new Error(`No ${model.name} found with id: ${modelQuery}`)

      } else {
        return foundModel
      }
    }
  }

  getters[searchModelName] = state => modelQuery => {
    return filter(Object.values(state[modelRepoName]), modelQuery)
  }


  // MUTATIONS
  const mutations = {}

  mutations[createModelName] = (state, modelToCreate) => {
    Vue.set(state[modelRepoName], modelToCreate.id, modelToCreate)
  }

  mutations[updateModelName] = (state, modelToUpdate) => {
    Vue.set(state[modelRepoName], modelToUpdate.id, modelToUpdate)
  }

  mutations[destroyModelName] = (state, modelToDestroy) => {
    delete state[modelRepoName][modelToDestroy.id]
  }


  // ACTIONS
  const actions = {}

  actions[createModelName] = ({ commit }) => {
    let newModel = model.create()

    commit(createModelName, newModel)

    return newModel.id
  }

  actions[updateModelName] = ({ commit, getters }, modelToUpdate) => {
    // throws if we can't find it
    getters[findModelName](modelToUpdate.id)

    commit(updateModelName, modelToUpdate)
  }

  actions[destroyModelName] = ({ commit, getters }, modelToDestroy) => {
    // throws if we can't find it
    getters[findModelName](modelToDestroy.id)

    commit(destroyModelName, modelToDestroy)
  }

  return { state, getters, mutations, actions }
}
