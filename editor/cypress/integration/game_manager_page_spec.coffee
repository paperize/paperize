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
      cy.contains "Game Manager"

    it.only "lets me create a new game", ->
      cy.wrap([1, 2, 3, 4, 5]).each ->
        cy.contains("New Game").click()

        cy.contains "Create a New Game"

        cy.get("input[name=title]").type("Love Letter")
        cy.get("textarea[name=description]").type("The instant classic microgame from Seiji Kanai.")
        cy.get("input[name=player-count]").type("2-4")
        cy.get("input[name=age-range]").type("6+")
        cy.get("input[name=play-time]").type("5-45 minutes")

        cy.get("input[type=submit]").click()

      cy.contains "Love Letter"

    it "lets me load an example game"

    context "with existing games", ->
      it "lists my games"
      it "lets me edit a game"
      it "lets me delete an existing game"
