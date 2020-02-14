xdescribe "Screenshots for Documentation", ->
  context "Getting Started", ->
    it "login button", ->
      cy.visit("/")
      cy.paperizeDocs("sign-in-link", ".log-in-button", wait: 200)

    describe "logged in", ->
      beforeEach ->
        cy.login()

      it "new game button and form", ->
        cy.paperizeDocs("new-game-button", ".new-game-button")
        cy.contains("New Game").click()
        cy.paperizeDocs("new-game-form", null, wait: 250)

      it "database link and popover", ->
        cy.paperizeDocs("database-link", ".database-button")
        cy.contains("Database").click()
        cy.paperizeDocs("database-popover", null, wait: 250)

    it "new component button", ->
      cy.loginAndEditGame("carcassonne")
      cy.paperizeDocs("new-component-button", ".new-component-button")
      cy.contains("New Component").click()
      cy.paperizeDocs("new-component-form", null, wait: 250)

    it "selected component screen", ->
      cy.loginAndEditGame("carcassonneWithComponent")
      cy.paperizeDocs("selected-component-screen", ".component-section")
      cy.paperizeDocs("spreadsheet-link", "#source-editor .mdi-google-spreadsheet", wait: 250)
      cy.paperizeDocs("edit-spreadsheet-link", "#source-editor button.edit-spreadsheet", wait: 250)
      cy.paperizeDocs("refresh-spreadsheet-link", "#source-editor button.refresh-spreadsheet", wait: 250)
      cy.get("button.edit-spreadsheet").click()
      cy.paperizeDocs("set-spreadsheet-menu", "#source-editor", wait: 500)
