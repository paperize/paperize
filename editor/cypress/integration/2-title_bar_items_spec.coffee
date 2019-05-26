describe "Title Bar items", ->
  context "Profile component", ->
    it "without login we see Sign In", ->
      cy.visit("/")
      cy.contains("Sign In")

    it "with login we see name and Sign Out", ->
      cy.login()
      cy.contains("Avid Gamer")
      cy.contains("Sign Out")

  context "Errors menu", ->
    it "is not visible without login, with error", ->
      cy.visit("/")
      cy.makePaperizeError()
      cy.contains("Errors").should("not.exist")

    it "is visible with login, with error", ->
      cy.login()
      cy.makePaperizeError()
      cy.contains("Errors")

    it.only "is not visible with login, without error", ->
      cy.login()
      cy.contains("Errors").should("not.exist")

    it "has a badge displaying quantity of unread errors", ->
      cy.login()
      # create 3 errors
      # .error-menu badge contains "3"
      # create 1 more error
      # .error-menu badge contains "4"
      cy.contains("Errors").click()
      # close the modal
      # .error-menu badge not visible
      # create 1 more error
      # .error-menu badge contains "1"
