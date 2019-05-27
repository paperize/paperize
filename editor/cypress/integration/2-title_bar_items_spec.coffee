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

    it "is not visible with login, without error", ->
      cy.login()
      cy.contains("Errors").should("not.exist")

    it.only "has a badge displaying quantity of unread errors", ->
      cy.login()
      cy.makePaperizeError(3)
      cy.get('.error-count').contains "3"
      cy.makePaperizeError(1)
      cy.get('.error-count').contains "4"
      # cy.contains("Errors").click()
      # close the modal
      # .error-menu badge not visible
      # create 1 more error
      # .error-menu badge contains "1"

    it.only "maxes out at 20 errors", ->
      cy.login()
      cy.makePaperizeError(19)
      cy.get('.error-count').contains 19
      cy.makePaperizeError(1)
      cy.get('.error-count').contains 20
      cy.makePaperizeError(1)
      cy.get('.error-count').contains 20

