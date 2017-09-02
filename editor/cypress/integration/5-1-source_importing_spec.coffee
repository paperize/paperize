describe "Importing Sources", ->
  beforeEach ->
    cy.login()
    cy.persistFixtures("games")
    cy.persistFixtures("sources")
    cy.visitFixtureGame("loveLetter")

    # stub Google API calls in this test
    cy.fixture("sources").its("loveLetter").then (loveLetter) ->
      cy.window().its("googleSheets").then (googleSheets) ->
        cy.stub(googleSheets, "fetchSheets").returns(Promise.resolve([loveLetter]))
        cy.stub(googleSheets, "fetchSheetById").returns(Promise.resolve(loveLetter))

  context "by pasting a Google Sheet URL or ID", ->
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

    describe "when i submit something valid", ->
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
        cy.contains('"Love Letter Revisited"')

  context "by browsing my Google Sheets", ->
    beforeEach ->
      cy.get("#source-manager")
        .contains("Browse Google Sheets")
          .click()

      cy.get("#source-explorer")
          .should("be.visible")

    it "has a title and call-to-action", ->
      cy.get("#source-explorer").within ->
        cy.contains("Browse Your Google Sheets")
        cy.get('a.button').contains("Fetch Sheet Listing...")

    describe.only "clicking 'fetch'", ->
      beforeEach ->
        cy.contains("Fetch Sheet Listing...")
            .click()

      it "hides the call-to-action and shows a spinner", ->
        cy.contains("Fetch Sheet Listing...").should("not.be.visible")

      it "hides the spinner and fills a menu based on the google response", ->
        cy.get("#source-explorer").within ->
          cy.contains("Love Letter Revisited")

      it "if an item's id is unknown, it can be added"
      it "if an item's id is known, it can be refreshed"

  context "refreshing the active source", ->
    it "nice call to action"
    it "prompts with diff before overwrite"
    it "overwrites the data if accepted"
    it "leaves the data if declined"
