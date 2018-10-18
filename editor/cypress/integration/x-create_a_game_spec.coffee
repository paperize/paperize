xdescribe "Creating a game from scratch", ->
  it "works", ->
    # use the login helper
    cy.loadSourcesIntoVuex()
    cy.login()

    # create a game
    cy.contains("New Game").click()
    cy.get(".game-title input").type("Factions{enter}")

    # create a characters component
    cy.contains("New Component").click()
    cy.get(".component-title input").type("Characters")
    cy.get(".component-form").contains("Close").click()
    # set the source
    cy.contains("Set a Source...").click()
    cy.get("#source-manager").within ->
      cy.contains("Characters").click()

    # edit the template
    cy.get("#template-editor").within ->
      cy.contains("edit").click()

    cy.contains("library_add").click()
    cy.contains("Text").click()
    cy.get(".text-size input").clear().type("24")
    cy.get(".text-content textarea").type("""
      {{}{{}Name}}
    """)

    cy.contains("library_add").click()
    cy.contains("Text").click()

    # cy.get("#dim-x").type("{backspace}35", delay: 300)
    cy.get("#dim-y").type("{backspace}50", delay: 300)
    cy.get(".text-size input").clear().type("24")
    cy.get(".text-content textarea").type("""
      Influence: {{}{{}Influence}}
    """)
    cy.get("button").contains("close").click()

    # create tokens component
    cy.contains("New Component").click()
    cy.get(".component-title input").type("Tokens")
    # set the size to be a 1" square
    cy.contains("Custom").click()
    cy.get(".paper-width input").type("{backspace}{backspace}{backspace}1", delay: 100)
    cy.get(".paper-height input").type("{backspace}{backspace}{backspace}1")
    cy.contains("Close").click()

    # set the source
    cy.contains("Set a Source...").click()
    cy.get("#source-manager").within ->
      cy.contains("Tokens").click()
    cy.get("#source-editor .quantity-property").click()
    cy.contains("Quantity").click()

    # edit the template
    cy.get("#template-editor").within ->
      cy.contains("edit").click()

    cy.contains("library_add").click()
    cy.contains("Shape").click()
    cy.get("#dim-x").type("{backspace}1.5", delay: 300)
    cy.get("#dim-y").type("{backspace}1.5", delay: 300)
    cy.get("#dim-w").type("{backspace}{backspace}97", delay: 300)
    cy.get("#dim-h").type("{backspace}{backspace}97")

    cy.get(".shape-select").click()
    cy.contains("Ellipse").click()

    cy.contains("library_add").click()
    cy.contains("Text").click()

    cy.get("#dim-x").type("{backspace}35", delay: 300)
    cy.get("#dim-y").type("{backspace}0", delay: 300)
    cy.get(".text-size input").clear().type("24")

    cy.get(".text-content textarea").type("""
      {{}{{}Abbr}}
    """)






















#
