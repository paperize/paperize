describe "Layer Dimensions", ->
  beforeEach ->
    cy.loginAndEditGame()
    cy.get("#template-editor").within ->
      cy.contains("Edit").click()

    cy.contains("New Layer").click()
    cy.contains("Shape").click()

  it.only "let's me toggle between coord/dims and inset mode", ->
    # see the x/y/w/h percent values
    # click inset
    # see the t/r/b/l percent values
    # click coord/dim
    # see the x/y/w/h percent values
