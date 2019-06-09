describe "Text Layers", ->
  beforeEach ->
    cy.server()
    # Text Layers fetch various font indices
    cy.route('/webfonts/v1/webfonts*', 'fixture:google_fonts_api.json')
      .as("googleFontsApi")

    cy.route('/Roboto-regular.ttf', 'fixture:Roboto-regular.ttf,binary')
    cy.route('/Roboto-100.ttf', 'fixture:Roboto-100.ttf,binary')
    cy.route('/Roboto-bold.ttf', 'fixture:Roboto-bold.ttf,binary')
    cy.route('/Roboto-italic.ttf', 'fixture:Roboto-italic.ttf,binary')
    cy.route('/Roboto-bolditalic.ttf', 'fixture:Roboto-bolditalic.ttf,binary')

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
    cy.contains("Roboto").click()

    cy.wait(1000)
    cy.get(".font-style-setting").click()
    cy.contains("regular").click()

    cy.contains("Text Content").click()
    cy.get(".text-content textarea")
      .type("Roboto")

  it "uses a template", ->
    cy.contains("Text Content").click()
    cy.get(".text-content textarea")
      .type("""
        n: {{}{{}n}}
        q: {{}{{}q}}
        Rank: {{}{{}Rank}}
      """)
