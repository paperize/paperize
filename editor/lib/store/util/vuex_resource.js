/* global process */
import Promise from 'bluebird'
import { capitalize, camelCase, map, zip, filter, values, isString, isNumber } from 'lodash'
import Vue from 'vue'

const VERBOSE = false
// const VERBOSE = (process.NODE_ENV !== "production")

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
  const existsModelName   = camelCase(`${singularModelName} exists`) // modelExists
  const findAllModelName  = camelCase(`find all ${pluralModelName}`) // findAllModels
  const allModelName      = camelCase(`all ${pluralModelName}`) // allModels
  const searchModelName   = camelCase(`search ${pluralModelName}`) // searchModels
  const createModelName   = camelCase(`create ${singularModelName}`) // createModel
  const setModelName      = camelCase(`set ${pluralModelName}`) // setModels
  const updateModelName   = camelCase(`update ${singularModelName}`) // updateModel
  const destroyModelName  = camelCase(`destroy ${singularModelName}`) // destroyModel


  // STATE (MODEL REPOSITORY)
  const state = {}
  state[modelRepoName] = {}
  debug(resourceName, state)


  // GETTERS
  const getters = {}

  getters[findModelName] = state => (modelId, throwOnFail=true) => {
    debug("Getter:", findModelName, modelId, "Throw?", throwOnFail)
    if(!isString(modelId) && !isNumber(modelId)) {
      if(throwOnFail) {
        throw new Error(`${capitalize(singularModelName)} ID format not recognized: (${modelId}), pass a string or number!`)
      } else {
        return null
      }

    } else {
      let foundModel = state[modelRepoName][modelId]

      if(!foundModel && throwOnFail) {
        const notFoundError = new Error(`No ${model.name} found with id: ${modelId}`)
        notFoundError.code = 'NOT_FOUND'
        throw notFoundError

      } else {
        return foundModel
      }
    }
  }

  getters[existsModelName] = (state, localGetters) => modelId => {
    debug("Getter:", existsModelName, modelId)
    return !!localGetters[findModelName](modelId, false)
  }

  getters[findAllModelName] = state => modelIds => {
    debug("Getter:", findAllModelName, modelIds)
    return map(modelIds, modelId => state[modelRepoName][modelId])
  }

  getters[allModelName] = state => {
    debug("Getter:", allModelName)
    return values(state[modelRepoName])
  }

  getters[searchModelName] = state => modelQuery => {
    debug("Getter:", searchModelName, modelQuery)
    return filter(Object.values(state[modelRepoName]), modelQuery)
  }


  // MUTATIONS
  const mutations = {}

  mutations[createModelName] = (state, modelToCreate) => {
    debug("Mutation:", createModelName, modelToCreate)
    Vue.set(state[modelRepoName], modelToCreate.id, modelToCreate)
  }

  mutations[setModelName] = (state, modelCollection) => {
    debug("Mutation:", setModelName, modelCollection)
    if(!modelCollection) {
      console.warn(`Why are you setting the "${modelRepoName}" store to "${modelCollection}"? This is likely a testing bug.`)
    }
    Vue.set(state, modelRepoName, modelCollection)
  }

  mutations[updateModelName] = (state, modelToUpdate) => {
    debug("Mutation:", updateModelName, modelToUpdate)
    Vue.set(state[modelRepoName], modelToUpdate.id, modelToUpdate)
  }

  mutations[destroyModelName] = (state, modelToDestroy) => {
    debug("Mutation:", destroyModelName, modelToDestroy)
    Vue.delete(state[modelRepoName], modelToDestroy.id)
  }


  // ACTIONS
  const actions = {}

  actions[createModelName] = ({ dispatch, commit }, modelDefaults={}) => {
    debug("Action:", createModelName, modelDefaults)
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
    debug("Action:", updateModelName, modelToUpdate)
    // throws if we can't find it
    getters[findModelName](modelToUpdate.id)

    commit(updateModelName, modelToUpdate)
  }

  actions[destroyModelName] = ({ getters, dispatch, commit }, modelToDestroy) => {
    debug("Action:", destroyModelName, modelToDestroy)
    // throws if we can't find it
    modelToDestroy = getters[findModelName](modelToDestroy.id)

    let hasOnesToDestroy = filter(model.relationships, { relation: 'hasOne', dependent: true })
    let hasManysToDestroy = filter(model.relationships, { relation: 'hasMany', dependent: true })

    return Promise.map(hasOnesToDestroy,
      // Destroy dependent hasOne relations
      (relationship) => {
        let relationToDestroyId = modelToDestroy[`${relationship.model}Id`]

        if(relationToDestroyId) {
          let relationshipDestroyModelName = camelCase(`destroy ${relationship.model}`)
          return dispatch(relationshipDestroyModelName, { id:  relationToDestroyId })
        } else {
          return
        }
      })

      .then(() => {
        return Promise.map(hasManysToDestroy,
          // Destroy dependent hasMany relations
          (relationship) => {
            let relationshipDestroyModelName = camelCase(`destroy ${relationship.model}`)
            return Promise.map(modelToDestroy[`${relationship.model}Ids`], (relationshipId) => {
              return dispatch(relationshipDestroyModelName, { id: relationshipId })
            })
          })
      })

      .then(() => {
        commit(destroyModelName, modelToDestroy)

        return modelToDestroy.id
      })
  }

  // Merge Vuex store mechanics from the provided model, provided methods take precedence
  return {
    state:     { ...state, ...model.state },
    getters:   { ...getters, ...model.getters },
    mutations: { ...mutations, ...model.mutations },
    actions:   { ...actions, ...model.actions },
  }
}
