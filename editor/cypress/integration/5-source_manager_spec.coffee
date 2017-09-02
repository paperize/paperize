describe "Component Source manager", ->
  context "with no sources imported", ->
    beforeEach ->
      cy.login()
      cy.persistFixtures("games")
      cy.visitFixtureGame("loveLetter")
      cy.get(".component").first().click()

    it "says so", ->
      cy.get("#source-manager")
        .contains("You have no sources.")

    describe "invites me to paste in a source URL or ID to import", ->
      submitPaste = (paste) ->
        cy.get("input[name='source-paste']")
            .type(paste)

        cy.get("#source-paste-form")
            .find(".button.success")
              .click()

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

      it "errors when ID can't be parsed", ->
        submitPaste("abcd1234")

        cy.contains("Error: No Google Sheet ID detected in \"abcd1234\"")

      it "errors when google sheet can't be fetched", ->
        cy.window().its("auth").then (auth) ->
          cy.stub(auth, 'getClient').callsArgWith(0, {
            sheets: {
              spreadsheets: {
                get: ->
                  then: (callback, errback) ->
                    errback({ status: 404 })

                values: {
                  get: -> throw new Error("YES!")
                }
              }
            },
            drive: {
              files: {
                get: ->
                  then: (callback, errback) ->
                    errback({ status: 404 })
              }
            }
          })

        submitPaste("xxxxxxxxxxxxxxxxxxxxxxxxx")

        cy.contains("Error: No Google Sheet found for ID: \"xxxxxxxxxxxxxxxxxxxxxxxxx\"")

      context "when i submit something valid", ->
        beforeEach ->
          cy.fixture("sources").its("loveLetter").then (loveLetter) ->
            cy.window().its("googleSheets").then (googleSheets) ->
              cy.stub(googleSheets, "fetchSheetById").returns(Promise.resolve(loveLetter))

          cy.get("input[name='source-paste']")
              .type("the mocked id")

          cy.get("#source-paste-form")
              .find(".button.success")
                .click()

        it "closes", ->
          cy.get("#source-paste-form")
              .should("not.be.visible")

        it "i see i have the new source selected", ->
          cy.contains('"Love Letter Revisited"')

    it "invites me to browse my GDrive for Sheets to import", ->
      cy.get("#source-manager")
        .contains("Browse Google Sheets")

  context "with existing sources", ->
    beforeEach ->
      cy.loginAndVisitGame("loveLetter")
      cy.get(".component").first().click()

    describe "no source selected", ->
      it "lists the sources i've already imported", ->
        cy.get("#source-manager").within ->
          cy.contains("Select a Source:")
          cy.contains("Love Letter Revisited")
          cy.contains("Carcassonne V1")
          cy.contains("Pandemic V2")

      it "allows me to select a source", ->
        cy.get("#source-manager")
          .contains("Love Letter Revisited")
          .click()

        cy.get("#source-manager")
          .contains('"Love Letter Revisited"')

      it "allows me to delete a source"

    describe "with a source selected", ->
      beforeEach ->
        cy.get("#source-manager")
          .contains("Love Letter Revisited")
          .click()

      it "shows me the exposed properties in a nice way", ->
        cy.get("#source-manager").within ->
          cy.get(".property-name").its("length").should("eq", 5)
          cy.contains("Quantity")
          cy.contains("Name")
          cy.contains("Rank")
          cy.contains("Image")
          cy.contains("Rule")

      it "allows me to deselect that source", ->
        cy.get("#source-manager")
          .find(".unset-source")
          .click()

        cy.get("#source-manager")
          .contains("Select a Source:")
