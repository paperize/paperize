describe("Splash Page", function() {
  beforeEach(function() {
    cy.visit("/")
  })

  it("successfully loads", function() {
    cy.contains("Welcome to New Paperize!")
  })
})
