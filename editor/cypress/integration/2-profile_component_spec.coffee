describe "Profile component", ->
  context "without login", ->
    beforeEach ->
      cy.visit("/")

    it "we see Sign In", ->
      cy.contains("Sign In")

  context "with login", ->
    beforeEach ->
      cy.login()

    it "we see our name", ->
      cy.contains("Avid Gamer")

    it "we see Sign Out", ->
      cy.contains("Sign Out")

    it "logs out when 'Sign Out' is clicked", ->
      cy.contains("Sign Out").click(force: true)
      cy.contains("Sign In")
