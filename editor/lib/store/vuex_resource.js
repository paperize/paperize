import Promise from 'bluebird'
import { capitalize, camelCase, map, zip, filter, find, values, isString, isNumber, isObject } from 'lodash'
import Vue from 'vue'

// const VERBOSE = false
const VERBOSE = true

const debug = (...args) => {
  if(VERBOSE) {
    console.log(...args)
  }
}

export function generateCrud(model) {

  // NAMING THINGS
  const pluralModelName   = model.name
  const singularModelName = pluralModelName.slice(0, pluralModelName.length - 1)
  const resourceName      = capitalize(singularModelName)
  const modelRepoName     = pluralModelName
  const findModelName     = camelCase(`find ${singularModelName}`) // findModel
  const findAllModelName  = camelCase(`find all ${pluralModelName}`) // findAllModels
  const allModelName      = camelCase(`all ${pluralModelName}`) // allModels
  const searchModelName   = camelCase(`search ${pluralModelName}`) // searchModels
  const createModelName   = camelCase(`create ${singularModelName}`) // createModel
  const updateModelName   = camelCase(`update ${singularModelName}`) // updateModel
  const destroyModelName  = camelCase(`destroy ${singularModelName}`) // destroyModel


  // STATE (MODEL REPOSITORY)
  const state = {}
  state[modelRepoName] = {}
  debug(resourceName, state)


  // GETTERS
  const getters = {}

  getters[findModelName] = state => modelQuery => {
    debug(findModelName)
    if(!isString(modelQuery) && !isNumber(modelQuery)) {
      throw new Error(`${capitalize(singularModelName)} ID format not recognized: ${modelQuery}, pass a string or number!`)

    } else {
      let foundModel = state[modelRepoName][modelQuery]

      if(!foundModel) {
        const notFoundError = new Error(`No ${model.name} found with id: ${modelQuery}`)
        notFoundError.code = 'NOT_FOUND'
        throw notFoundError

      } else {
        return foundModel
      }
    }
  }

  getters[findAllModelName] = state => modelIds => {
    debug(findAllModelName)
    return map(modelIds, modelId => state[modelRepoName][modelId])
  }

  getters[allModelName] = state => {
    debug(allModelName)
    return values(state[modelRepoName])
  }

  getters[searchModelName] = state => modelQuery => {
    debug(searchModelName)
    return filter(Object.values(state[modelRepoName]), modelQuery)
  }


  // MUTATIONS
  const mutations = {}

  mutations[createModelName] = (state, modelToCreate) => {
    debug(createModelName)
    Vue.set(state[modelRepoName], modelToCreate.id, modelToCreate)
  }

  mutations[updateModelName] = (state, modelToUpdate) => {
    debug(updateModelName)
    Vue.set(state[modelRepoName], modelToUpdate.id, modelToUpdate)
  }

  mutations[destroyModelName] = (state, modelToDestroy) => {
    debug(destroyModelName)
    delete state[modelRepoName][modelToDestroy.id]
  }


  // ACTIONS
  const actions = {}

  actions[createModelName] = ({ dispatch, commit }, modelDefaults={}) => {
    debug(createModelName)
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
    debug(updateModelName)
    // throws if we can't find it
    getters[findModelName](modelToUpdate.id)

    commit(updateModelName, modelToUpdate)
  }

  actions[destroyModelName] = ({ getters, dispatch, commit }, modelToDestroy) => {
    debug(destroyModelName)
    // throws if we can't find it
    getters[findModelName](modelToDestroy.id)

    let relationshipsToDestroy = filter(model.relationships, { relation: 'hasOne' })

    return Promise.map(relationshipsToDestroy, (relationship) => {
      let relationshipDestroyModelName = camelCase(`destroy ${relationship.model}`)
      return dispatch(relationshipDestroyModelName, { id: modelToDestroy[`${relationship.model}Id`] })
    })

    .then(() => {
      commit(destroyModelName, modelToDestroy)

      return modelToDestroy.id
    })
  }

  // Merge store mechanics from the model

  return {
    state:     { ...state, ...model.state},
    getters:   { ...getters, ...model.getters},
    mutations: { ...mutations, ...model.mutations},
    actions:   { ...actions, ...model.actions},
  }
}
