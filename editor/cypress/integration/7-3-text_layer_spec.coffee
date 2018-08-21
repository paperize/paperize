describe "Text Layers", ->
  beforeEach ->
    cy.loginAndEditGame()
    cy.get("#template-editor").within ->
      cy.contains("Edit").click()

    cy.contains("New Layer").click()
    cy.contains("Text").click()

  it "is created", ->
    cy.contains("[text] 0")

  it.only "can be set to rectangle", ->
    cy.get(".text-layer-fields .text-content")
      .type("""
        n: {{}{{}n}}
        q: {{}{{}q}}
        Rank: {{}{{}Rank}}
      """)
