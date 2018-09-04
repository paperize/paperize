xdescribe "Creating a game from scratch", ->
  it "works", ->
    # use the login helper
    cy.loadSourcesIntoVuex()
    cy.login()

    # create a game
    cy.contains("New Game").click()
    cy.get("#game-title").type("Factions{enter}")

    # create a characters component
    cy.contains("New Component").click()
    cy.get(".component-title-new").type("Characters{enter}")
    # set the source
    cy.contains("Set a Source...").click()
    cy.get("#source-manager").within ->
      cy.contains("Characters").click()

    # edit the template
    cy.get("#template-editor").within ->
      cy.contains("Edit").click()

    cy.contains("New Layer").click()
    cy.contains("Text").click()
    cy.get("#text-size").select("24")
    cy.get(".text-content").type("""
      {{}{{}Name}}
    """)

    cy.contains("New Layer").click()
    cy.get(".dialog-buttons").within ->
      cy.contains("Text").click()

    # cy.get("#dimension-x").type("{backspace}35", delay: 300)
    cy.get("#dimension-y").type("{backspace}50", delay: 300)
    cy.get("#text-size").select("24")
    cy.get(".text-content").type("""
      Influence: {{}{{}Influence}}
    """)
    cy.get(".close-button").click()

    # create tokens component
    cy.contains("New Component").click()
    cy.get(".component-title-new").type("Tokens")
    # set the size to be a 1" square
    cy.contains("Custom Size").click()
    cy.get("#paper-width").type("{backspace}{backspace}{backspace}1", delay: 100)
    cy.get("#paper-height").type("{backspace}{backspace}{backspace}1")
    cy.contains("Close").click()

    # set the source
    cy.contains("Set a Source...").click()
    cy.get("#source-manager").within ->
      cy.contains("Tokens").click()
    cy.get("#quantity-property").select("Quantity")

    # edit the template
    cy.get("#template-editor").within ->
      cy.contains("Edit").click()

    cy.contains("New Layer").click()
    cy.contains("Shape").click()
    cy.get("#dimension-x").type("{backspace}1.5", delay: 300)
    cy.get("#dimension-y").type("{backspace}1.5", delay: 300)
    cy.get("#dimension-w").type("{backspace}{backspace}97", delay: 300)
    cy.get("#dimension-h").type("{backspace}{backspace}97")

    cy.get(".shape-settings select").select("Ellipse")

    cy.contains("New Layer").click()
    cy.contains("Text").click()

    cy.get("#dimension-x").type("{backspace}35", delay: 300)
    cy.get("#dimension-y").type("{backspace}0", delay: 300)
    cy.get("#text-size").select("48")

    cy.get(".text-content").type("""
      {{}{{}Abbr}}
    """)






















#
