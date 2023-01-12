// const lodash = require('lodash')
import lodash from 'lodash'
const { reduce } = lodash

// unit descriptive strings
export const PIXELS_STRING = 'Pixels'
export const POINTS_STRING = 'Points'
export const INCHES_STRING = 'Inches'
export const CENTIMETERS_STRING = 'Centimeters'
export const MILLIMETERS_STRING = 'Millimeters'

export const W_STRING = 'Width'
export const H_STRING = 'Height'
export const PERCENT_STRING   = 'Percent of Width | Height'
export const PERCENT_W_STRING = 'Percent of Width'
export const PERCENT_H_STRING = 'Percent of Height'

export const PARENT_W_STRING = 'Parent Width'
export const PARENT_H_STRING = 'Parent Height'
export const PERCENT_PARENT_STRING   = 'Percent of Parent Width | Height'
export const PERCENT_PARENT_W_STRING = 'Percent of Parent Width'
export const PERCENT_PARENT_H_STRING = 'Percent of Parent Height'


// absolute unit ids
export const PIXELS = 'px'
export const POINTS = 'pt'
export const INCHES = 'in'
export const CENTIMETERS = 'cm'
export const MILLIMETERS = 'mm'
// relative unit ids (self)
export const W = 'w'
export const H = 'h'
export const PERCENT   = '%'
export const PERCENT_W = '%w'
export const PERCENT_H = '%h'
// relative unit ids (parent)
export const PARENT_W = 'ww'
export const PARENT_H = 'hh'
export const PERCENT_PARENT   = '%%'
export const PERCENT_PARENT_W = '%%w'
export const PERCENT_PARENT_H = '%%h'
// undefined unit ids
export const UNDEFINED = ''

// compatability unit ids
export const COMPATIBILITY = {
  'percent'    : PERCENT,
  'pixels'     : PIXELS ,
  'inches'     : INCHES ,
  'millimeters': MILLIMETERS
}

// array of all absolute and relative unit ids
export const ALL = [
  // absolute unit ids
  PIXELS,
  POINTS,
  INCHES,
  CENTIMETERS,
  MILLIMETERS,
  // relative unit ids (self)
  W, H,
  PERCENT,
  PERCENT_W,
  PERCENT_H,
  // relative unit ids (parent)
  PARENT_W,
  PARENT_H,
  PERCENT_PARENT,
  PERCENT_PARENT_W,
  PERCENT_PARENT_H
]

// conversion constants
export const MILLIMETERS_PER_INCH = 25.4
export const CENTIMETERS_PER_INCH = 2.54

// wh mode constants - determines the behavior of '%' unit
export const WH_MODE = {
  W : true , // WH_MODE.W - '%' unit is based on parent w
  H : false  // WH_MODE.H - '%' unit is based on parent h
}

// defaults
export const DEFAULT_PIXELS_PER_INCH = 144
export const DEFAULT_POINTS_PER_INCH =  72
export const DEFAULT_WH_MODE = WH_MODE.W
export const DEFAULT_UNIT_OPTIONS = {
  pixelsPerInch : DEFAULT_PIXELS_PER_INCH,
  pointsPerInch : DEFAULT_POINTS_PER_INCH,
  parentW  : 0,
  parentH  : 0,
  w : 0, h : 0,
  whMode : DEFAULT_WH_MODE
}

// error property
export const ERROR = 'error'

/**
 * Converts a value from one type of unit to another.
 *
 * @param {number} value
 * @param {string} from - the unit id to convert from
 * @param {string} to   - the unit id to convert to
 * @param {number} options.pixelsPerInch - defines the size of rasterized  elements, default is 72 pixels per inch
 * @param {number} options.pointsPerInch - defines the size of typographic elements, default is 72 points per inch
 * @param {number} options.parentW - the width  of the parent container in pixels, default is 0
 * @param {number} options.parentH - the height of the parent container in pixels, default is 0
 * @param {number} options.w - the width  of the current container in pixels, default is 0
 * @param {number} options.h - the height of the current container in pixels, default is 0
 * @param {boolean} options.whMode - determines the behavior of '%' unit, default is WH_MODE.W
 * @returns {number}
 */
export function convert(value, from, to = PIXELS, options = DEFAULT_UNIT_OPTIONS) {
  // bypass if conversion is unecessary
  if(from === to)
    return value

  // populate options
  options = { ...DEFAULT_UNIT_OPTIONS, ...options }

  // create conversion table
  const units = { }

  // absolute units
  units[PIXELS]      = options.pixelsPerInch // pixels per inch
  units[POINTS]      = options.pointsPerInch // points per inch
  units[INCHES]      = 1                     // inches per inch
  units[CENTIMETERS] = CENTIMETERS_PER_INCH  // cm per inch
  units[MILLIMETERS] = MILLIMETERS_PER_INCH  // mm per inch

  // relative units (self)
  units[W] = options.pixelsPerInch / options.w                            // current w per inch
  units[H] = options.pixelsPerInch / options.h                            // current h per inch
  units[PERCENT_W] = options.pixelsPerInch / options.w * 100              // percent of current w per inch
  units[PERCENT_H] = options.pixelsPerInch / options.h * 100              // percent of current h per inch
  units[PERCENT]   = options.whMode ? units[PERCENT_W] : units[PERCENT_H] // percent of current w|h per inch

  // relative units (parent)
  units[PARENT_W] = options.pixelsPerInch / options.parentW                                    // parent w per inch
  units[PARENT_H] = options.pixelsPerInch / options.parentH                                    // parent h per inch
  units[PERCENT_PARENT_W] = options.pixelsPerInch / options.parentW * 100                      // percent of parent w per inch
  units[PERCENT_PARENT_H] = options.pixelsPerInch / options.parentH * 100                      // percent of parent h per inch
  units[PERCENT_PARENT]   = options.whMode ? units[PERCENT_PARENT_W] : units[PERCENT_PARENT_H] // percent of parent w|h per inch

  // undefined units
  units[UNDEFINED] = units[to] // undefined units are coverted into the target space 1:1

  if(!from in units)
    from = COMPATIBILITY[from]
  if(!to   in units)
    to   = COMPATIBILITY[to  ]

  // perform conversion
  value /= units[from]
  value *= units[to  ]
  return value
}

// compute
export function compute(computable, to = PIXELS, options = DEFAULT_UNIT_OPTIONS) {
  switch(typeof computable) {
  case 'string' : return computeExpression(computable, to, options)
  case 'object' : return computeEvaluation(computable, to, options)
  }
}

export function computeExpression(expression, to = PIXELS, options = DEFAULT_UNIT_OPTIONS) {
  const evaluated = evaluate(expression)

  return reduce(evaluated, (result, value, unit) => {
    return result + convert(value, unit, to, options)
  }, 0)
}

export function computeEvaluation(evaluation, to = PIXELS, options = DEFAULT_UNIT_OPTIONS) {
  const evaluated = { ...evaluation }

  return reduce(evaluated, (result, value, unit) => {
    return result + convert(value, unit, to, options)
  }, 0)
}

export function stringify(computable, preferred = UNDEFINED) {
  switch(typeof computable) {
  case 'string': return stringifyExpression(computable, preferred)
  case 'object': return stringifyEvaluation(computable, preferred)
  }
}

export function stringifyExpression(expression, preferred = UNDEFINED) {
  const evaluated = evaluate(expression)

  const u = evaluated[UNDEFINED]
  evaluated[UNDEFINED]  = 0
  evaluated[preferred] += u

  return reduce(evaluated, (result, value, unit) => {
    if(unit !== ERROR)
      if(value !== 0) {
        if(result.length > 0) {
          if(value > 0)
            result += ' + '
          if(value < 0)
            result += ' - '
        } else if(value < 0)
          result += '-'
        result += Math.abs(value) + unit
      }
    return result
  }, '').trim()
}

export function stringifyEvaluation(evaluation, preferred = UNDEFINED) {
  const evaluated = { ...evaluation }

  const u = evaluated[UNDEFINED]
  evaluated[UNDEFINED]  = 0
  evaluated[preferred] += u

  return reduce(evaluated, (result, value, unit) => {
    if(value !== 0) {
      if(result.length > 0) {
        if(value > 0)
          result += ' + '
        if(value < 0)
          result += ' - '
      } else if(value < 0)
        result += '-'
      result += Math.abs(value) + unit
    }
    return result
  }, '').trim()
}

// helper functions
const _isWhitespace = (c) => (c === ' ' || c === '\t' || c === '\n' || c === '\r')
const _isLetter = (c) => (c === '%' || c >= 'a' && c <= 'z')
const _isNumber = (c) => (c === '.' || c >= '0' && c <= '9')
const _isBlank  = (s) => (s.trim() === '')

// evaluate
export function evaluate(expression, preferred = UNDEFINED) {
  // sanitize expression
  const s = expression.trim().toLowerCase()

  // result table
  const result = { }

  // absolute units
  result[PIXELS]      = 0
  result[POINTS]      = 0
  result[INCHES]      = 0
  result[CENTIMETERS] = 0
  result[MILLIMETERS] = 0

  // relative units (self)
  result[W]           = 0
  result[H]           = 0
  result[PERCENT  ]   = 0
  result[PERCENT_W]   = 0
  result[PERCENT_H]   = 0

  // relative units (parent)
  result[PARENT_W]         = 0
  result[PARENT_H]         = 0
  result[PERCENT_PARENT]   = 0
  result[PERCENT_PARENT_W] = 0
  result[PERCENT_PARENT_H] = 0

  // undefined units
  result[UNDEFINED]   = 0

  // evaluation variables
  let stack = []
  let word  = ''
  let sign  =  1
  // mode is used to detect changes in contiguous expressions
  // (e.g. '1px' instead of '1 px') where the whitespace would
  // normally indicate a transition from letter to number or vice versa
  let mode

  // error string
  let error

  // inner helper functions

  // push word buffer onto stack and reset
  function _stackPush() {
    if(!_isBlank(word)) {
      stack.push(word)
      word = ''
    }
  }

  // evaluate the top of the stack
  function _stackPull() {
    // if the next element exists
    if(stack.length > 0) {
      let v = 1 // value, default to 1
      let u     // unit

      u = stack.pop()

      // if next element is not a number then assume it is a unit string
      if(isNaN(u)) {
        // if next element exists and is a number then pop stack and assign value
        // * in this case, a value has been pushed onto the stack followed by a unit
        if(stack.length > 0 && !isNaN(stack[stack.length - 1])) {
          v = stack.pop()
        }
        // if unit is not in result table then assign error and default to preferred unit
        if(!(u in result)) {
          if(!error) {
            error = `Undefined unit '${u}'`
          }
          u = preferred
        }
      } else {
        // else assign value and default to preferred unit
        // * in this case, a value has been pushed onto the stack without a unit
        //   we would use the user selected unit-mode to evaluate the expression
        //   OR leave unlabeled values as UNDEFINED
        v = u
        u = preferred
      }

      // augment result index
      result[u] += sign * v

      // reset the sign
      sign = 1
    }
  }

  // evaluation loop
  [...s].forEach((c) => {
    if(_isWhitespace(c)) {
      // if character is whitespace then
      _stackPush()     // push word buffer onto the stack
      mode = undefined // clear mode
    } else if (c === '+') {
      // if character is the addition operator then
      _stackPush()     // push word buffer onto the stack
      _stackPull()     // evaluate the top of the stack
      //sign *=  1
      mode = undefined // clear mode
    } else if (c === '-') {
      // if character is the subtraction operator then
      _stackPush()     // push word buffer onto the stack
      _stackPull()     // evaluate the top of the stack
      sign *= -1       // flip sign
      mode = undefined // clear mode
    } else {
      // else character is part of a word
      // if character is a letter and word mode is NOT letter then
      if(_isLetter(c) && mode !== 'letter') {
        _stackPush()    // push word buffer onto the stack
        mode = 'letter' // assign mode
      }
      // if character is a number and word mode is NOT number then
      if(_isNumber(c) && mode !== 'number') {
        _stackPush()    // push word buffer onto the stack
        _stackPull()    // evaluate the top of the stack
        mode = 'number' // assign mode
      }
      word += c
    }
  })

  // push dangling word buffer onto the stack
  _stackPush()
  // evaluate the top of the stack while there are remaining elements
  while(stack.length > 0)
    _stackPull()

  // if error string was assigned, include error in the result table
  if(error)
    result[ERROR] = error

  return result
}
