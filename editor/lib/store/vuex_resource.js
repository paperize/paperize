import Promise from 'bluebird'
import { camelCase, map, zip, filter, find, isString, isNumber, isObject } from 'lodash'
import Vue from 'vue'

export function generateCrud(model) {

  // NAMING THINGS
  const pluralModelName = model.name
  const singularModelName = pluralModelName.slice(0, pluralModelName.length - 1)
  const modelRepoName = pluralModelName
  const findModelName    = camelCase(`find ${singularModelName}`) // findModel
  const findAllModelName = camelCase(`find all ${pluralModelName}`) // findAllModels
  const searchModelName  = camelCase(`search ${pluralModelName}`) // searchModels
  const createModelName  = camelCase(`create ${singularModelName}`) // createModel
  const updateModelName  = camelCase(`update ${singularModelName}`) // updateModel
  const destroyModelName = camelCase(`destroy ${singularModelName}`) // destroyModel


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

  getters[findAllModelName] = state => modelIds => {
    return modelIds.map(modelId => state[modelRepoName][modelId])
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

  actions[createModelName] = ({ dispatch, commit }, modelDefaults={}) => {
    let newModel = model.create(modelDefaults)

    let relationshipsToInitialize = filter(model.relationships, (relation) => relation.initialize)

    return Promise.map(relationshipsToInitialize, (relationship) => {
      let relationshipCreateModelName = camelCase(`create ${relationship.model}`)
      return dispatch(relationshipCreateModelName)
    })

    .then((relationshipIds) => {
      zip(map(relationshipsToInitialize, 'model'), relationshipIds).forEach((nameAndId) => {
        newModel[`${nameAndId[0]}Id`] = nameAndId[1]
      })

      commit(createModelName, newModel)

      return newModel.id
    })

  }

  actions[updateModelName] = ({ getters, commit }, modelToUpdate) => {
    console.log('updating', model.name, modelToUpdate)
    // throws if we can't find it
    getters[findModelName](modelToUpdate.id)

    commit(updateModelName, modelToUpdate)
  }

  actions[destroyModelName] = ({ getters, dispatch, commit }, modelToDestroy) => {
    // throws if we can't find it
    getters[findModelName](modelToDestroy.id)

    let relationshipsToDestroy = filter(model.relationships, { relation: 'hasOne' })

    return Promise.map(relationshipsToDestroy, (relationship) => {
      let relationshipDestroyModelName = camelCase(`destroy ${relationship.model}`)
      return dispatch(relationshipDestroyModelName, { id: modelToDestroy[`${relationship.model}Id`] })
    })

    .then(() => {
      commit(destroyModelName, modelToDestroy)

      return null
    })
  }

  return { state, getters, mutations, actions }
}
