describe("The Home Page", function() {
  it("Visits the Kitchen Sink", function() {
    cy.visit("https://example.cypress.io")

    cy.contains("type").click()

    cy.get("h1").should('contain', "Actions")
    cy.get("h4").should('contain', "cy.type()")
  })

  it.only("successfully loads", function() {
    cy.visit("http://localhost:3000/") // change URL to match your dev URL
  })
})
