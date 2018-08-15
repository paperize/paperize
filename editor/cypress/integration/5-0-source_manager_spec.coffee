describe "Component Source manager", ->
  beforeEach ->
    cy.loginAndEditGame()
    cy.contains("Instruction Book").click()

  it "prompts me to create a source", ->
    cy.get("#source-editor")
      .contains("This component does not have a data Source set.")

    cy.get(".button")
      .contains("Set a Source...")

  context "with existing sources", ->
    beforeEach ->
      cy.loadSourcesIntoVuex()

    describe "no source selected", ->
      beforeEach ->
        cy.get(".button")
        .contains("Set a Source...")
        .click()

      it "prompts to set a source", ->
        cy.get("#source-manager").within ->
          cy.contains("You need to load a component source...")

      it "lists the sources i've already imported", ->
        cy.get("#source-manager").within ->
          cy.contains("Source Manager")
          cy.contains("Love Letter Revisited")
          cy.contains("Carcassonne")
          cy.contains("Pandemic V2")
            .should("be.visible")

      it "allows me to select a source", ->
        cy.get("#source-manager .set-source")
          .first()
          .click()

        cy.get("#source-editor")
          .contains('Love Letter Revisited')

      it "allows me to delete a source", ->
        cy.get("#source-editor")
          .find('a.delete-source')
          .first()
          .click()

        cy.get("button")
          .contains("Yes")
          .click()

        cy.get("#source-manager").within ->
          cy.contains("Love Letter Revisited")
            .should("not.exist")

    describe "with a source selected", ->
      beforeEach ->
        cy.get(".button")
          .contains("Set a Source...")
          .click()

        cy.get("#source-manager .set-source")
          .first()
          .click()

      it "shows me the exposed properties in a nice way", ->
        cy.get("#source-editor").within ->
          cy.get(".property-name").its("length").should("eq", 5)
          cy.contains("Quantity")
          cy.contains("Name")
          cy.contains("Rank")
          cy.contains("Image")
          cy.contains("Rule")

      context "editing the source", ->
        beforeEach ->
          cy.get('#source-editor').within ->
            cy.get(".button")
              .contains("Edit")
              .click()

        it "allows me to refresh that source", ->
          cy.get("#source-manager")
            .contains("Refresh Now")

        it "allows me to deselect that source", ->
          cy.get("#source-manager")
            .contains("Change Now...")
            .click()

          cy.get("#source-manager")
            .contains("You need to load a component source...")
