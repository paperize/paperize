describe "Text Layers", ->
  beforeEach ->
    cy.loginAndEditGame()
    cy.get("#template-editor").within ->
      cy.contains("edit").click()

    cy.contains("library_add").click()
    cy.contains("Text").click()

  it "is created", ->
    cy.contains("[text] 0")

  it "uses a template", ->
    cy.get(".text-content textarea")
      .type("""
        n: {{}{{}n}}
        q: {{}{{}q}}
        Rank: {{}{{}Rank}}
      """)
