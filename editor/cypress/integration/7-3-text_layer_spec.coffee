describe "Text Layers", ->
  beforeEach ->
    cy.server()
    # Text Layers fetch various font indices
    cy.route('/webfonts/v1/webfonts*', 'fixture:google_fonts_api.json')
      .as("googleFontsApi")

    cy.route('/PermanentMarker.ttf', 'fixture:PermanentMarker.ttf,binary')
      .as("PM.ttf")

    cy.loginAndEditGame()
    cy.get("#template-editor").within ->
      cy.contains("edit").click()

    cy.contains("library_add").click()
    cy.contains("Text").click()

    # Layers are already fetching fonts, wait on them
    cy.wait("@googleFontsApi")

  it "gets created and auto-named", ->
    cy.contains("library_add").click()
    cy.contains("Text").click()

    cy.contains("[text] 0")
    cy.contains("[text] 1")

  it.only "sets fonts", ->
    cy.get(".font-settings").click()
    cy.get(".font-family-setting").click()
    cy.contains("Permanent Marker").click()

    cy.contains("Text Content").click()
    cy.get(".text-content textarea")
      .type("Permanent Marker")

    cy.wait("@PM.ttf")

  it "uses a template", ->
    cy.contains("Text Content").click()
    cy.get(".text-content textarea")
      .type("""
        n: {{}{{}n}}
        q: {{}{{}q}}
        Rank: {{}{{}Rank}}
      """)
