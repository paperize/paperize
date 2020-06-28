describe "Spreadsheet management", ->
  context "magic columns", ->
    before ->
      cy.loginAndEditGame("magic")

    it "colorful shapes and text", ->
      cy.get("#source-editor").contains("Available Properties")
      cy.get("#source-editor").contains("Magical Properties")

      cy.get("#template-editor").within ->
        cy.contains("edit").click()

      cy.contains("library_add").click()
      cy.contains("Shape").click()

      cy.contains("Layer Name: \"Shape\"").click()
      cy.get(".layer-name-input input").clear().type("Background Box")

      cy.contains("Fill").click()
      cy.contains("Fill?").click()

      cy.contains("library_add").click()
      cy.contains("Text").click()

      cy.contains("Layer Name: \"Text\"").click()
      cy.get(".layer-name-input input").clear().type("Name")

      cy.contains("Text Content").click()
      cy.get(".text-content textarea")
        .type("Colorized Text")
