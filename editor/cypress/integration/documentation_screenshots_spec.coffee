describe "Screenshots for Documentation", ->
  context "Getting Started", ->
    it "login button", ->
      cy.visit("/")
      cy.paperizeDocs("sign-in-link", ".log-in-button", wait: 200)

    describe "logged in", ->
      before ->
        cy.login()

      it "database link and popover", ->
        cy.paperizeDocs("database-link", ".database-button")

        cy.contains("Database").click()
        cy.paperizeDocs("database-popover")

      it "new game button and form", ->
        cy.paperizeDocs("new-game-button", ".new-game-button")

        cy.contains("New Game").click()
        cy.paperizeDocs("new-game-form", null, wait: 250)

    describe "editing game", ->
      before ->
        cy.loginAndEditGame()

      it.only "new component button", ->
        cy.paperizeDocs("new-component-button", ".new-component-button")

        cy.contains("New Component").click()
        cy.paperizeDocs("new-component-form")
