describe "Component Source manager", ->
  beforeEach ->
    cy.loginAndVisitGame("loveLetter")
    cy.get(".component").first().click()

  context "with no sources imported", ->
    it "says so", ->
      cy.get("#source-manager")
        .contains("You have no sources.")

    describe "invites me to paste in a source URL or ID to import", ->
      beforeEach ->
        cy.get("#source-manager")
          .contains("Paste a Link")
            .click()

        cy.get("#source-paste-form")
            .should("be.visible")

      it "closes when i cancel", ->
        cy.get("#source-paste-form")
            .find(".button.alert")
              .click()

        cy.get("#source-paste-form")
            .should("not.be.visible")

      context "when i submit something invalid", ->
        beforeEach ->
          cy.get("input[name='source-paste']")
              .type("abcd1234")

          cy.get("#source-paste-form")
              .find(".button.success")
                .click()

        it.only "shows a good error message", ->
          cy.contains("Error: No Google Sheet ID detected in \"abcd1234\"")

      context "when i submit something valid", ->
        # TODO: mock the google sheet fetcher
        beforeEach ->
          cy.get("input[name='source-paste']")
              .type("the mocked id")

          cy.get("#source-paste-form")
              .find(".button.success")
                .click()

        it "closes", ->
          cy.get("#source-paste-form")
              .should("not.be.visible")

        it "i see i have the new source selected", ->
          cy.contains("Source: Love Letter V2")

    it "invites me to browse my GDrive for Sheets to import", ->
      cy.get("#source-manager")
        .contains("Browse Google Sheets")

  context "with existing sources but none selected", ->
    it "lists the sources i've already imported", ->
      cy.get("#source-manager").within ->
        cy.contains("Love Letter V3")
        cy.contains("Carcassonne V1")
        cy.contains("Pandemic V2")

    it "3 allows me to select a source", ->
      cy.get("#source-manager")
        .contains("Love Letter V3")
        .click()

      cy.get("#source-manager")
        .contains("Source: Love Letter V3")

    it "allows me to delete a source"

  context "with a source selected", ->
    beforeEach ->
      cy.get("#source-manager")
        .contains("Love Letter V3")
        .click()

    it "shows me the exposed properties in a nice way", ->
      cy.get("#source-manager").within ->
        cy.get("dt").its("length").should("eq", 4)
        cy.contains("Property Name:")
        cy.contains("Name")
        cy.contains("Rank")
        cy.contains("Image")
        cy.contains("Rule")


    it "allows me to deselect that source"
