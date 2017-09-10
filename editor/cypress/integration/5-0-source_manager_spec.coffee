describe "Component Source manager", ->
  beforeEach ->
    cy.vuexAndFixtures ({ vuex, fixtures: { users, games } }) ->
      allGames = Object.values(games)
      loveLetter = games['loveLetter']
      firstComponent = loveLetter.components[0]

      vuex.dispatch("become", users[0])
      vuex.commit("setGames", { games: allGames })
      vuex.dispatch("setActiveGame", { gameId: loveLetter.id })
      vuex.dispatch("setActiveComponent", { component: firstComponent })

    .visitActiveGameAndComponent()

  it "prompts me to create a source", ->
    cy.get("#source-manager")
      .contains("You have no sources.")

  context "with existing sources", ->
    beforeEach ->
      cy.loadSourcesIntoVuex()

    describe "no source selected", ->
      it "lists the sources i've already imported", ->
        cy.get("#source-manager").within ->
          cy.contains("Select a Source:")
          cy.contains("Love Letter Revisited")
          cy.contains("Carcassonne")
          cy.contains("Pandemic V2")

      it "allows me to select a source", ->
        cy.get("#source-manager")
          .contains("Love Letter Revisited")
          .click()

        cy.get("#source-manager")
          .contains('"Love Letter Revisited"')

      it "allows me to delete a source", ->
        cy.get("#source-manager")
          .find('a.delete-source')
          .first()
          .click()

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

      it "allows me to refresh that source", ->
        cy.get("#source-manager")
          .contains("refresh")

      it "allows me to deselect that source", ->
        cy.get("#source-manager")
          .find(".unset-source")
          .click()

        cy.get("#source-manager")
          .contains("Select a Source:")
