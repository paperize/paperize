const
  fetchSheetById = () => {
    return Promise.resolve({
      id:   'abc123',
      name: "Cypress Test Sheet",
      worksheets: []
    })
  }

export default { fetchSheetById }
