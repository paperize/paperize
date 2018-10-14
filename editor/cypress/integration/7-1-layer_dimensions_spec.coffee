describe "Layer Dimensions", ->
  beforeEach ->
    cy.loginAndEditGame()
    cy.get("#template-editor").within ->
      cy.contains("edit").click()

    cy.contains("library_add").click()
    cy.contains("Shape").click()

  it "let's me set inches as the unit of measure", ->
    cy.get("#dimension-editor").within ->
      cy.contains('in').click()

  it "let's me set millimeters as the unit of measure", ->
    cy.get("#dimension-editor").within ->
      cy.contains('mm').click()

  it "let's me set pixels as the unit of measure", ->
    cy.get("#dimension-editor").within ->
      cy.contains('px').click()

  it "let's me set percent as the unit of measure", ->
    cy.get("#dimension-editor").within ->
      cy.contains('%').click()

  it "let's me toggle between xywh and inset mode", ->
    cy.get("#dimension-editor").within ->
      # see the x/y/w/h percent values
      cy.get("#dim-x input").invoke("val").should("eq", "5.0")
      cy.get("#dim-y input").invoke("val").should("eq", "5.0")
      cy.get("#dim-w input").invoke("val").should("eq", "90.0")
      cy.get("#dim-h input").invoke("val").should("eq", "90.0")
      # click inset
      cy.contains("Inset").click()
      # see the t/r/b/l percent values
      cy.get("#dim-t input").invoke("val").should("eq", "5.0")
      cy.get("#dim-r input").invoke("val").should("eq", "5.0")
      cy.get("#dim-b input").invoke("val").should("eq", "5.0")
      cy.get("#dim-l input").invoke("val").should("eq", "5.0")
      # set them all to 10
      setVal10ThenChill = (input) ->
        input.val("10")
        input[0].dispatchEvent(new Event('input', { 'bubbles': true }))
        cy.wait(400)

      cy.get("#dim-t input").then(setVal10ThenChill)
      cy.get("#dim-r input").then(setVal10ThenChill)
      cy.get("#dim-b input").then(setVal10ThenChill)
      cy.get("#dim-l input").then(setVal10ThenChill)
      # click xywh
      cy.contains("XYWH").click()
      # see the x/y/w/h percent values
      cy.get("#dim-x input").invoke("val").should("eq", "10.0")
      cy.get("#dim-y input").invoke("val").should("eq", "10.0")
      cy.get("#dim-w input").invoke("val").should("eq", "80.0")
      cy.get("#dim-h input").invoke("val").should("eq", "80.0")
