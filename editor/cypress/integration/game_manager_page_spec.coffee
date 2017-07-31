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
      cy.visit("/#/games")

    it "says Game Manager", ->
      cy.contains("Game Manager")

    it.only "lets me create a new game", ->
      cy.contains("New Game").click()

    it "lets me load an example game"

    context "with existing games", ->
      it "lists my games"
      it "lets me edit a game"
      it "lets me delete an existing game"
