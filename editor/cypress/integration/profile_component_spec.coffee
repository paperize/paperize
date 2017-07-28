describe "Profile component", ->
  context "without login", ->
    beforeEach ->
      cy.visit("/")

    it "'Sign In' link is active", ->
      cy.contains("Sign In").should("have.class", "active")

    it "'Sign Out' link is not active", ->
      cy.contains("Sign Out").should("not.have.class", "active")

  context "with login", ->
    beforeEach ->
      localStorage.setItem('id_token', 'test_login')

      localStorage.setItem 'persistence', JSON.stringify
        'test_login':
          profile:
            name: 'Avid Gamer',
            avatarSrc: 'http://placehold.it/20/20'
          games: []

      cy.visit("/")

    it "'Sign In' link is not active", ->
      cy.contains("Sign In").should("not.have.class", "active")

    it "'Sign Out' link is active and profile info is visible", ->
      cy.contains("Sign Out").should("have.class", "active")

      cy.contains("Avid Gamer").should("have.class", 'active')

      cy.get('.avatar')
        .should("have.class", 'active')
        .then ($avatarImg) ->
          expect($avatarImg.attr('src')).to.eq 'http://placehold.it/20/20'

    it "logs out when 'Sign Out' is clicked", ->
      cy.contains("Sign Out").click()
      cy.contains("Sign In").should("have.class", "active")
      cy.contains("Sign Out").should("not.have.class", "active")
