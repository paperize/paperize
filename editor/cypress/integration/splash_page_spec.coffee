describe "Splash Page", ->
  context "without login", ->
    beforeEach ->
      cy.visit("/")

    it "successfully loads", ->
      cy.contains("Welcome to New Paperize!")

  context "with login", ->
    beforeEach ->
      localStorage.setItem('id_token', 'test_login')
      cy.visit("/")

    it "forwards to the Game Manager", ->
      cy.url().should("match", /\/games/)
