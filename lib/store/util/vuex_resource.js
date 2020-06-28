// Dead Simple ORM for Vuex
// Hand it a vuex-like object, it returns a vuex-like object embellished with
// getters, mutations, actions

import { capitalize, camelCase, debounce, filter, isString, isNumber, map,
  memoize, values, without, wrap, zip } from 'lodash'
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
  const foreignKeyName    = `${singularModelName}Id`
  const findModelName     = camelCase(`find ${singularModelName}`) // findModel
  const existsModelName   = camelCase(`${singularModelName} exists`) // modelExists
  const findAllModelName  = camelCase(`find all ${pluralModelName}`) // findAllModels
  const allModelName      = camelCase(`all ${pluralModelName}`) // allModels
  const searchModelName   = camelCase(`search ${pluralModelName}`) // searchModels
  const createModelName   = camelCase(`create ${singularModelName}`) // createModel
  const copyModelName     = camelCase(`copy ${singularModelName}`) // copyModel
  const setModelName      = camelCase(`set ${pluralModelName}`) // setModels
  const updateModelName   = camelCase(`update ${singularModelName}`) // updateModel
  const patchModelName    = camelCase(`patch ${singularModelName}`) // patchModel
  const destroyModelName  = camelCase(`destroy ${singularModelName}`) // destroyModel


  // STATE (MODEL REPOSITORY)
  const state = {}
  state[modelRepoName] = {}
  debug(resourceName, state)

  // Params: { getters, dispatch, commit }, { type, payload }
  const subscribe = () => {
    // Default does nothing, override in models
  }


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
        const notFoundError = new Error(`No ${pluralModelName} found with id: ${modelId}`)
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

    let relationshipsToInitialize = filter(model.relationships, { initialize: true })

    return Promise.map(relationshipsToInitialize, (relationship) => {
      let relationshipCreateModelName = camelCase(`create ${relationship.model}`)
      return dispatch(relationshipCreateModelName)
    })

      .then((relationshipIds) => {
        zip(map(relationshipsToInitialize, 'model'), relationshipIds).forEach(([name, id]) => {
          newModel[`${name}Id`] = id
        })

        commit(createModelName, newModel)

        return newModel.id
      })
  }

  actions[copyModelName] = ({ dispatch, commit, getters }, existingModel) => {
    debug("Action:", copyModelName, existingModel)
    const newModel = model.create({ ...existingModel })

    return new Promise((resolve) => {

      // Deep copy hasMany relationships
      const hasManyRelationships = filter(model.relationships, { relation: "hasMany"})
      return Promise.each(hasManyRelationships, relationship => {
        const
          // List of many relations
          relationIds = existingModel[`${relationship.model}Ids`],
          // The name of the find method for this relationship
          relationshipFindModelName = camelCase(`find ${relationship.model}`),
          // The name of the copy method for this relationship
          relationshipCopyModelName = camelCase(`copy ${relationship.model}`)

        return Promise.map(relationIds, (relationId) => {
          // Look up the relation
          const relationObject = getters[relationshipFindModelName](relationId, true)
          // Copy the relation
          return dispatch(relationshipCopyModelName, relationObject)

        }).then((relationObjectIds) => {
          // set the foreign keys on our new model object
          // like: model.layerIds = ["123", "abc", "1a9z"]
          newModel[`${relationship.model}Ids`] = relationObjectIds
        })

      }).then(() => {
        // Initialize hasOne relationships with initialize flag
        const
          hasOneRelationships = filter(model.relationships, { relation: "hasOne", initialize: true }),
          hasOneModels = map(hasOneRelationships, "model")

        return Promise.map(hasOneRelationships, (relationship) => {
          const
            // Id of existing relation
            relationId = existingModel[`${relationship.model}Id`],
            // The name of the find method for this relationship
            relationshipFindModelName = camelCase(`find ${relationship.model}`),
            // The name of the copy method for this relationship
            relationshipCopyModelName = camelCase(`copy ${relationship.model}`),
            // Look up the relation
            relationObject = getters[relationshipFindModelName](relationId, true)

          // Copy the relation
          return dispatch(relationshipCopyModelName, relationObject)

        }).then((hasOneRelationshipIds) => {
          zip(hasOneModels, hasOneRelationshipIds).forEach(([modelName, relationshipId]) => {
            // set the foreign keys on our new model object
            // like: componentId = "abc123"
            newModel[`${modelName}Id`] = relationshipId
          })
        // finally create the model object and return its id
        }).then(() => {
          commit(createModelName, newModel)
          resolve(newModel.id)
        })
      })
    })
  }

  actions[updateModelName] = ({ getters, commit }, modelToUpdate) => {
    debug("Action:", updateModelName, modelToUpdate)
    // throws if we can't find it
    getters[findModelName](modelToUpdate.id)

    commit(updateModelName, modelToUpdate)
  }

  // Debounce Patch calls scoped to ID and the values being patched
  const actualPatch = ({ getters, commit }, modelToPatch) => {
    // Lookup existing
    const existingModel = getters[findModelName](modelToPatch.id)
    // Do regular update and extend the patched items
    commit(updateModelName, { ...existingModel, ...modelToPatch})
  }

  const PATCH_DELAY_MS = 500
  const debouncedPatch = wrap(memoize(
    // Get a new debounced patch
    () => {
      return debounce(actualPatch, PATCH_DELAY_MS)
    },
    // Cache key: id-key1-key2-...-keyN
    (_, modelToPatch) => {
      const patchKeys = without(Object.keys(modelToPatch), "id").join("-")
      return `${modelToPatch.id}-${patchKeys}`
    }
    // Pulls the appropriate memoized function then calls it
  ), (func, store, model) => {
    return func(store, model)(store, model)
  })

  actions[patchModelName] = (store, modelToPatch) => {
    debug("Action:", patchModelName, modelToPatch)
    debouncedPatch(store, modelToPatch)
  }

  actions[destroyModelName] = ({ getters, rootGetters, dispatch, commit }, modelToDestroy) => {
    debug("Action:", destroyModelName, modelToDestroy)
    // throws if we can't find it
    modelToDestroy = getters[findModelName](modelToDestroy.id)

    const
      hasOnesToDestroy = filter(model.relationships, { relation: 'hasOne', dependent: true }),
      hasManysToDestroy = filter(model.relationships, { relation: 'hasMany', dependent: true }),
      referencesToNullify = filter(model.relationships, { relation: 'referencedBy', dependent: "nullify" })

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
        return Promise.map(referencesToNullify,
          // Nullify other models' references to this model
          (relationship) => {
            const searchGetterName = camelCase(`search ${relationship.model}s`)
            const modelsToNullify = rootGetters[searchGetterName](model => model[foreignKeyName] == modelToDestroy.id)
            const patchActionName = camelCase(`patch ${relationship.model}`)

            return Promise.map(modelsToNullify, (model) => {
              // Construct a patch payload (id and what to change)
              let patchPayload = { id: model.id }
              patchPayload[foreignKeyName] = null
              // Call the foreign model's patch action
              return dispatch(patchActionName, patchPayload)
            })
          }
        )
      })

      .then(() => {
        // Do what we came here to do: destroy the model
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
    subscribe: model.subscribe || subscribe
  }
}
