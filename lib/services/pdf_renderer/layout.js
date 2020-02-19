import { flatten, groupBy, times, values } from 'lodash'
import { MODE_AUTO_LAYOUT, MODE_COMPONENT_PER_PAGE } from '../../store/print'
import { startEmptyDocument } from './document'

const COMPONENT_SPACING_AMOUNT = 0.08

export function doLayout(componentSizes, printSettings) {
  const doc = startEmptyDocument()
  let itemLocations,
    guideLocations = []
  if(printSettings.mode == MODE_AUTO_LAYOUT) {
    itemLocations = autoLayoutItems(doc, componentSizes, printSettings)
  } else if(printSettings.mode == MODE_COMPONENT_PER_PAGE) {
    itemLocations = componentPerPageItemLayout(doc, componentSizes, printSettings)
  }

  return { doc, itemLocations, guideLocations }
}

export function autoLayoutItems(doc, componentSizes, printSettings) {
  const pageSize = {
      w: printSettings.width,
      h: printSettings.height
    },
    { marginTop, marginRight, marginBottom, marginLeft } = printSettings,
    totalHorizontalMargin = marginLeft + marginRight,
    totalVerticalMargin = marginTop + marginBottom,
    printablePageSize = {
      w: (pageSize.w - totalHorizontalMargin),
      h: (pageSize.h - totalVerticalMargin)
    }

  if(printSettings.componentMerging) {
    // Group components by size
    componentSizes =
      flatten(
        values(
          groupBy(componentSizes, ({ size }) => `${size.w}x${size.h}`)))
  }

  let
    lastW = 0,
    lastH = 0,
    lastX = 0,
    lastY = 0,
    currentPage = 0,
    itemLocations = componentSizes.reduce((locations, { size, name, quantity }) => {

      // make sure there's a slot for this kind of component
      locations[name] = locations[name] || []

      // Multi-Page Component
      if(size.w > printablePageSize.w || size.h > printablePageSize.h) {
        // component is larger than the print medium
        // stripe the component across multiple pages

        while(quantity > 0) {
          const horizontalPages = Math.ceil(size.w / printablePageSize.w),
            verticalPages = Math.ceil(size.h / printablePageSize.h)

          let locationCollection = []
          for(let pageY = 0; pageY < verticalPages; pageY ++) {
            for(let pageX = 0; pageX < horizontalPages; pageX ++) {
              currentPage += 1

              locationCollection.push({
                page: currentPage,
                ...size, // { w, h }
                x: marginLeft - (pageX * printablePageSize.w),
                y: marginRight - (pageY * printablePageSize.h)
              })
            }
          }

          locations[name].push(locationCollection)

          quantity -= 1
        }

      // Multi-Component Page
      } else {
        // the component fits into the print medium
        // lay it out in rows and columns

        // Do we start this component on a new page, or do will it merge with the last one?
        // if component merging is disabled or either dimension is different
        if (!printSettings.componentMerging || (lastW !== size.w || lastH !== size.h)) {
          // Start a new page!
          lastX = 0
          lastY = 0
          currentPage += 1
        }
        lastW = size.w
        lastH = size.h

        // TODO: look up spacer settings
        const spacer = printSettings.componentSpacing ? COMPONENT_SPACING_AMOUNT : 0

        // once per item
        while(quantity > 0){
          let thisX = lastX,
            thisY = lastY

          // Start new row
          if(thisX + size.w > printablePageSize.w) {
            // if x is past width (right side of medium page), reset x and increment y
            thisX = lastX = 0
            thisY = lastY = lastY + size.h + spacer
            // TODO: + spacer if spacing enabled

            // Start new page
            if(thisY + size.h > printablePageSize.h) {
              // if y is past height (bottom of medium page), reset y and increment page
              thisY = lastY = 0
              currentPage += 1
            }
          }

          locations[name].push({
            page: currentPage,
            ...size, // { w, h }
            x: marginLeft + thisX,
            y: marginTop + thisY
          })

          lastX += size.w + spacer
          // TODO: + spacer if spacing enabled
          quantity -= 1
        }
      }

      return locations
    }, {})

  // Add all needed pages to doc
  times(currentPage, () => {
    doc.addPage([pageSize.w, pageSize.h])
  })

  return itemLocations
}

export function componentPerPageItemLayout(doc, componentSizes) {
  let currentPage = 0
  return componentSizes.reduce((locations, { size, name, quantity }) => {
    // initialize a slot for this collection of components
    locations[name] = locations[name] || []
    // execute once per item
    times(quantity,() => {
      // add a page to the doc of the exact size (no margins)
      doc.addPage([size.w, size.h])
      // bump the page number
      currentPage += 1
      // add an item location...
      locations[name].push({
        ...size,
        page: currentPage, // ...on the new page number...
        x: 0, // ...at the top left
        y: 0
      })
    })
    return locations
  }, {})
}
