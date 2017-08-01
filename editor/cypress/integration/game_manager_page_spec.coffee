describe "Game Manager page", ->
  context "when not logged in", ->
    it "shows a message about logging in", ->
      cy.visit("/#/games")

      cy.window().then (win) ->
        cy.stub(win.lock, "show")

      cy.contains("You are not logged in.")
      cy.contains("log in").click()

      cy.window().then (win) ->
        expect(win.lock.show).to.be.called

  context "logged in", ->
    beforeEach ->
      cy.login()

    context "with no games", ->
      beforeEach ->
        cy.visit("/#/games")

      it "says Game Manager", ->
        cy.contains "Game Manager"

      it "lets me create a new game", ->
        cy.contains("New Game").click()
        cy.contains "Create a New Game"

        cy.typeIntoSelectors
          "input[name=title]":          "Love Letter"
          "textarea[name=description]": "The instant classic microgame from Seiji Kanai."
          "input[name=player-count]":   "2-4"
          "input[name=age-range]":      "6+"
          "input[name=play-time]":      "5-45 minutes"

        cy.get("input[type=submit]").click()

        cy.contains "Love Letter"
        cy.contains "The instant classic"
        cy.contains "2-4"
        cy.contains "6+"
        cy.contains "5-45 minutes"

      it "lets me create 3 games", ->
        cy.wrap(["Love Letter", "Carcassonne", "Pandemic"]).each (title) ->
          cy.contains("New Game").click()
          cy.get("input[name=title]").invoke("val").should("eq", "")
          cy.get("input[name=title]").type(title)
          cy.get("input[type=submit]").click()
          cy.contains(title)

      it "lets me load an example game"

    context "with existing games", ->
      beforeEach ->
        cy.loadGameFixtures()
        cy.visit("/#/games")

      it "lists my games", ->
        cy.get(".game").its("length").should("eq", 3)

      it "lets me edit a game", ->
        cy.get("#game-carcassonne")
          .contains("Edit")
          .click()

        cy.url().should("match", /games\/carcassonne/)

      it "lets me delete an existing game", ->
        cy.get("#game-carcassonne")
          .contains("Delete")
          .click()

        cy.get("game-carcassonne").should("not.exist")
