import jsPDF from 'jspdf'

// Fonts
import arialNormal from './fonts/Arial-normal'
arialNormal(jsPDF.API)

export function singlePageDocOfSize(size) {
  const doc = startEmptyDocument()

  doc.addPage([size.w, size.h])

  return doc
}

export function startEmptyDocument() {
  // Set units
  const doc = new jsPDF({ unit: 'in' })
  // Clear the auto-generated page
  doc.deletePage(1)

  return doc
}
