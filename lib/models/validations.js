import parseColor from 'color-parse'
import { clamp, includes, isBoolean, isNaN, isNull, isNumber, isString,
  isUndefined, reduce } from 'lodash'

export const validateBoolean = (maybeBoolean) => {
  // detect if already good Boolean
  if(isBoolean(maybeBoolean)) {
    return maybeBoolean
  }
  // detect if forced to false or true
  if(isString(maybeBoolean)) {
    const reducedMaybeBoolean = maybeBoolean.trim().toLowerCase()
    if(reducedMaybeBoolean === 'false') {
      return false
    } else if(reducedMaybeBoolean === 'true') {
      return true
    }
  }
}

export const validateColor = (maybeColor) => {
  window.global = window
  const parsedColor = parseColor(maybeColor)

  if(parsedColor && parsedColor.values && parsedColor.values.length == 3) {
    const { 0: r, 1: g, 2: b } = parsedColor.values

    return { r, g, b}
  }
}

export const validateIncluded = (collection) => (maybeIncluded) => {
  if(includes(collection, maybeIncluded)) {
    return maybeIncluded
  }
}

export const validateEqual = (predicate) => (maybeEqual) => {
  if(maybeEqual == predicate) {
    return maybeEqual
  }
}

export const validateIntegerBetween = (min, max) => (maybeInteger) => {
  let integer
  if(isNumber(maybeInteger)) {
    integer = Math.round(maybeInteger)
  } else if(isString(maybeInteger)) {
    integer = parseInt(maybeInteger, 10)
  }

  if(integer && !isNaN(integer)) {
    integer = clamp(integer, min, max)
    return integer
  }
}

export const validateDecimalBetween = (min, max) => (maybeDecimal) => {
  let decimal
  if(isNumber(maybeDecimal)) {
    decimal = maybeDecimal
  } else if(isString(maybeDecimal)) {
    decimal = parseFloat(maybeDecimal)
  }

  if(decimal && !isNaN(decimal)) {
    decimal = clamp(decimal, min, max)
    return decimal
  }
}

export const transformEach = function(newLayer, fallbackLayer, validations, options={}) {
  const
    // apply validation to each key, delete key if fail
    validatedLayer = reduce(fallbackLayer, (acc, fallbackValue, key) => {
      // look up validation to apply
      const validation = validations[key]

      if(!validation) {
        acc[key] = fallbackValue
        return acc
      }

      const
        newValue = newLayer[key],
        validatedValue = validation && validation(newValue),
        validatedFallback = validation && validation(fallbackValue)

      // if successful, call the callback
      if(!isNaN(validatedValue) && !isNull(validatedValue) && !isUndefined(validatedValue)) {
        if(options.doTransform) {
          acc[key] = validatedValue
        } else {
          acc[key] = newValue
        }
      } else {
        if(options.doTransform) {
          acc[key] = validatedFallback
        } else {
          acc[key] = fallbackValue
        }
      }

      return acc
    }, { ...fallbackLayer })

  // extend fallbackLayer with the pruned and validated new layer
  return validatedLayer
}
