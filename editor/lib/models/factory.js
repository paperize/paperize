// Simply replaces all functions with their return value
let process = (object) => {
  // each property
  for(let key in object) {
    // if property is a function
    if (typeof object[key] === "function") {
      // overwrite the property with its function's return value
      object[key] = object[key]()
    }
  }

  return object
}

let withinXofY = (x, y) => Math.round(Math.random()*(x*2) - x + y)
let around = (x) => withinXofY(x*.05, x)

module.exports = { process, around, withinXofY }
