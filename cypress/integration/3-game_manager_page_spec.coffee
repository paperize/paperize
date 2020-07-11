describe "Game Manager page", ->
  context "when not logged in", ->
    it "redirects home", ->
      cy.visit("/#/games")
      cy.setStoreReady()
      cy.url().should("match", /#\/$/)

  context "logged in", ->
    beforeEach ->
      cy.login()

    context "with no games", ->
      it "says Game Manager", ->
        cy.contains "Game Manager"

      it "lets me create a new game", ->
        cy.get("button").contains("New Game").click()
        cy.get(".game-title input").type("Love Letter")
        cy.get("button").contains("Start Designing").click()

        cy.url().should("match", /games\/.+$/)

        cy.get('.headline').contains "Love Letter"

      it "lets me create 3 games", ->
        cy.wrap(["Love Letter", "Carcassonne", "Pandemic"]).each (title) ->
          cy.contains("New Game").click()
          cy.get(".game-title input").invoke("val").should("eq", "")
          cy.get(".game-title input").type(title)
          cy.get("button").contains("Start Designing").click()
          cy.get('.headline').contains(title)

          cy.contains("Paperize.io").click()

      it "lets me load an example game"

    context "with existing games", ->
      beforeEach ->
        cy.loadGamesIntoVuex()

      it "lets me edit a game", ->
        cy.get("#game-carcassonne")
          .contains("Edit")
          .click()

        cy.url().should("match", /games\/carcassonne/)

      it "lets me delete an existing game", ->
        cy.get("#game-carcassonne")
          .contains("Delete")
          .click()

        cy.get("button")
          .contains("Yes")
          .click()

        cy.get("#game-carcassonne").should("not.exist")
