describe "Layer Dimensions", ->
  beforeEach ->
    cy.loginAndEditGame()
    cy.get("#template-editor").within ->
      cy.contains("Edit").click()

    cy.contains("New Layer").click()
    cy.contains("Shape").click()

  it "let's me toggle between xywh and inset mode", ->
    cy.get("#dimension-editor").within ->
      # see the x/y/w/h percent values
      cy.get("#dimension-x").invoke("val").should("eq", "5")
      cy.get("#dimension-y").invoke("val").should("eq", "5")
      cy.get("#dimension-w").invoke("val").should("eq", "90")
      cy.get("#dimension-h").invoke("val").should("eq", "90")
      # click inset
      cy.contains("Inset").click()
      # see the t/r/b/l percent values
      cy.get("#dimension-t").invoke("val").should("eq", "5")
      cy.get("#dimension-r").invoke("val").should("eq", "5")
      cy.get("#dimension-b").invoke("val").should("eq", "5")
      cy.get("#dimension-l").invoke("val").should("eq", "5")
      # set them all to 10
      setVal10ThenChill = (input) ->
        input.val("10")
        input[0].dispatchEvent(new Event('input', { 'bubbles': true }))
        cy.wait(400)

      cy.get("#dimension-t").then(setVal10ThenChill)
      cy.get("#dimension-r").then(setVal10ThenChill)
      cy.get("#dimension-b").then(setVal10ThenChill)
      cy.get("#dimension-l").then(setVal10ThenChill)
      # click xywh
      cy.contains("XYWH").click()
      # see the x/y/w/h percent values
      cy.get("#dimension-x").invoke("val").should("eq", "10")
      cy.get("#dimension-y").invoke("val").should("eq", "10")
      cy.get("#dimension-w").invoke("val").should("eq", "80")
      cy.get("#dimension-h").invoke("val").should("eq", "80")
