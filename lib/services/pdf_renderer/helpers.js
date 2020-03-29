import parseColor from 'color-parse'
import { find } from 'lodash'

const
  findProperty = function(item, key) {
    const property = find(item, { key })
    if(property) {
      return property.value
    } else {
      console.log(`No property found by key: ${key}`)
      return ""
    }
  },

  multiplyDimensions = ({ x, y, w, h }, scale) => {
    return {
      x: x * scale,
      y: y * scale,
      w: w * scale,
      h: h * scale,
    }
  },

  percentOfParent = function(dimensions, parent) {
    const percentDimensions = multiplyDimensions(dimensions, .01)
    return {
      x: (percentDimensions.x*parent.w)+(parent.x || 0),
      y: (percentDimensions.y*parent.h)+(parent.y || 0),
      w: percentDimensions.w*parent.w,
      h: percentDimensions.h*parent.h,
    }
  },

  // extract RGB255 from hex
  hexToRGB = function(hexColorString) {
    let r = parseInt(`${hexColorString[1]}${hexColorString[2]}`, 16),
      g = parseInt(`${hexColorString[3]}${hexColorString[4]}`, 16),
      b = parseInt(`${hexColorString[5]}${hexColorString[6]}`, 16)

    return { r, g, b }
  },

  anyToRGB = function(fuzzyInput) {
    const
      parsedColor = parseColor(fuzzyInput),
      { 0: r, 1: g, 2: b } = parsedColor.values

    return { r, g, b }
  }

export { findProperty, multiplyDimensions, percentOfParent, hexToRGB, anyToRGB }
