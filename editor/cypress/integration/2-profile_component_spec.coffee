describe "Profile component", ->
  context "without login", ->
    beforeEach ->
      cy.visit("/")

    it "we see Sign In", ->
      cy.contains("Sign In")

    describe "logging in", ->
      context "with standard db", ->
        it "tells what it's doing"
        it "loads the data"

      context "without standard db", ->
        it "tells what it's doing"
        it "initializes and loads the database", ->
          # stub googleLogin
          # stub google drive query
          cy.contains("Sign In").click()

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
