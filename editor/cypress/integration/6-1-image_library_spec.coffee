describe "Image Library", ->
  it "opens with a click", ->
    cy.login()
    cy.contains("Images").click()

    cy.contains("Image Library")
