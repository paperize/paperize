import { flatten, forEach, groupBy, map, values } from 'lodash'
import { MODE_AUTO_LAYOUT, MODE_COMPONENT_PER_PAGE } from '../../store/print'

const COMPONENT_SPACING_AMOUNT = 0.08

export function doLayout(items, printSettings) {
  if(printSettings.mode == MODE_AUTO_LAYOUT) {
    return autoLayoutItems(items, printSettings)
  } else if(printSettings.mode == MODE_COMPONENT_PER_PAGE) {
    return componentPerPageItemLayout(items, printSettings)
  }
}

export function autoLayoutItems(items, printSettings) {
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

  // Sort components by size then component id
  if(printSettings.componentMerging) {
    // Group components by size
    items =
      flatten(
        values(
          // like 2.5x3.5:abc123
          groupBy(items, ({ componentId, size }) => `${size.w}x${size.h}:${componentId}`)))
  }

  let
    lastW = 0,
    lastH = 0,
    lastX = 0,
    lastY = 0,
    currentPage = 0,
    lastItemComponentId

  forEach(items, (item) => {
    // Multi-Page Component
    if(item.size.w > printablePageSize.w || item.size.h > printablePageSize.h) {
      // component is larger than the print medium
      // stripe the component across multiple pages
      const horizontalPages = Math.ceil(item.size.w / printablePageSize.w),
        verticalPages = Math.ceil(item.size.h / printablePageSize.h)

      item.locations = []
      for(let pageY = 0; pageY < verticalPages; pageY ++) {
        for(let pageX = 0; pageX < horizontalPages; pageX ++) {
          currentPage += 1

          item.locations.push({
            pageSize,
            page: currentPage,
            ...item.size, // { w, h }
            x: marginLeft - (pageX * printablePageSize.w),
            y: marginRight - (pageY * printablePageSize.h)
          })
        }
      }

    // Multi-Component Page
    } else {
      // the component fits into the print medium
      // lay it out in rows and columns

      // If we're on a component boundary and not merging components
      // or we're on a component boundary and the dimensions are different
      if ((!printSettings.componentMerging && item.componentId != lastItemComponentId) ||
          (lastW !== item.size.w || lastH !== item.size.h)) {
        // Start a new page!
        lastX = 0
        lastY = 0
        currentPage += 1
      }
      lastItemComponentId = item.componentId
      lastW = item.size.w
      lastH = item.size.h

      const spacer = printSettings.componentSpacing ? COMPONENT_SPACING_AMOUNT : 0

      let thisX = lastX,
        thisY = lastY

      // Start new row
      if(thisX + item.size.w > printablePageSize.w) {
        // if x is past width (right side of medium page), reset x and increment y
        thisX = lastX = 0
        thisY = lastY = lastY + item.size.h + spacer

        // Start new page
        if(thisY + item.size.h > printablePageSize.h) {
          // if y is past height (bottom of medium page), reset y and increment page
          thisY = lastY = 0
          currentPage += 1
        }
      }

      item.location = {
        pageSize,
        page: currentPage,
        ...item.size, // { w, h }
        x: marginLeft + thisX,
        y: marginTop + thisY
      }

      lastX += item.size.w + spacer
    }
  })

  return items
}

export function componentPerPageItemLayout(items) {
  let currentPage = 0

  return map(items, (item) => {
    currentPage += 1
    // teach the item its location...
    item.location = {
      page: currentPage, // ...on the new page...
      pageSize: item.size,
      x: 0, // ...at the top left...
      y: 0,
      ...item.size, // ...with same w, h as its template
    }

    return item
  })
}
