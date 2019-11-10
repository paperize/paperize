describe "Print Settings", ->
  beforeEach ->
    cy.loginAndEditGame()

  it "opens the dialog when i click Print Settings", ->
    cy.contains("Print Settings").click()
    cy.get(".headline").contains("Print Settings")

  context "inside dialog", ->
    beforeEach ->
      cy.contains("Print Settings").click()

    it "defaults to Auto Layout mode", ->
      cy.contains("Paper Size")
      cy.contains("Minimum Margins")

    it "switches to Component Per Page mode", ->
      cy.contains("Component Per Page").click()
      cy.contains("Paper Size").should("not.exist")
      cy.contains("Minimum Margins").should("not.exist")
