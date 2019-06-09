describe "Spreadsheet management", ->
  context "magic columns", ->
    before ->
      cy.loginAndEditGame("magic")

    it.only "makes a color", ->
      cy.get("#source-editor").contains("Available Properties")
      cy.get("#source-editor").contains("Magical Properties")
