describe "Component Source manager", ->
  context "with no sources imported", ->
    beforeEach ->
      cy.login()
      cy.persistFixtures("games")
      cy.visitFixtureGame("loveLetter")

    it "says so", ->
      cy.get("#source-manager")
        .contains("You have no sources.")

  context "with existing sources", ->
    beforeEach ->
      cy.loginAndVisitGame("loveLetter")

    describe "no source selected", ->
      it "lists the sources i've already imported", ->
        cy.get("#source-manager").within ->
          cy.contains("Select a Source:")
          cy.contains("Love Letter Revisited")
          cy.contains("Carcassonne V1")
          cy.contains("Pandemic V2")

      it "allows me to select a source", ->
        cy.get("#source-manager")
          .contains("Love Letter Revisited")
          .click()

        cy.get("#source-manager")
          .contains('"Love Letter Revisited"')

      it "allows me to delete a source"

    describe "with a source selected", ->
      beforeEach ->
        cy.get("#source-manager")
          .contains("Love Letter Revisited")
          .click()

      it "shows me the exposed properties in a nice way", ->
        cy.get("#source-manager").within ->
          cy.get(".property-name").its("length").should("eq", 5)
          cy.contains("Quantity")
          cy.contains("Name")
          cy.contains("Rank")
          cy.contains("Image")
          cy.contains("Rule")

      it "allows me to deselect that source", ->
        cy.get("#source-manager")
          .find(".unset-source")
          .click()

        cy.get("#source-manager")
          .contains("Select a Source:")
