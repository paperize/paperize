describe "Profile component", ->
  context "without login", ->
    beforeEach ->
      cy.visit("/")

    it "we see .unauthenticated elements", ->
      cy.get(".unauthenticated")
      cy.get(".authenticated").should('not.exist')

  context "with login", ->
    beforeEach ->
      cy.login()

    it "we see .authenticated elements", ->
      cy.get(".authenticated")
      cy.get(".unauthenticated").should('not.exist')

    it "profile info is visible", ->
      cy.get('.avatar')

      cy.get('.name').contains "Avid Gamer"

    it "logs out when 'Sign Out' is clicked", ->
      cy.get(".authenticated .menu a").click(force: true)
      cy.get(".unauthenticated")
      cy.get(".authenticated").should('not.exist')
