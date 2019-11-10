describe "Splash Page", ->
  it "has a bunch of stuff on the splash page", ->
    cy.visit("/")
    # The name of the app
    cy.contains("Paperize.io")
    # A helpful call to action for newbies
    cy.contains("Get Started")
    # Obvious place to sign in for old pros
    cy.contains("Sign In")
