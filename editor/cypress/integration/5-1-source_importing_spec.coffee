describe "Importing Sources", ->
  beforeEach ->
    cy.loginAndEditGame()

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
        cy.fixture("sources").its("loveLetter").then (loveLetter) ->
          cy.window().its("googleSheets").then (googleSheets) ->
            cy.stub(googleSheets, "fetchSheets").returns(Promise.resolve([loveLetter]))
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

  context "by browsing my Google Sheets", ->
    beforeEach ->
      # stub Google API calls in this test
      cy.fixture("sources").then (sources) ->
        cy.window().its("googleSheets").then (googleSheets) ->
          cy.stub(googleSheets, "fetchSheets").returns(Promise.resolve([sources.loveLetter, sources.carcassonne]))
          cy.stub(googleSheets, "fetchSheetById").returns(Promise.resolve(sources.loveLetter))


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

    describe "clicking 'fetch'", ->
      beforeEach ->
        cy.contains("Fetch Sheet Listing...")
            .click()

      it "hides the call-to-action and shows a spinner", ->
        cy.contains("Fetch Sheet Listing...").should("not.be.visible")

      it "hides the spinner"

      context "lists new sources", ->
        beforeEach ->
          cy.vuexAndFixtures ({ vuex, fixtures: { sources }}) ->
            vuex.commit("setSources", [sources.carcassonne])

        it "adds new sources", ->
          cy.get("#source-explorer").within ->
            cy.contains("Love Letter Revisited (Add)")

        it "refreshes existing sources", ->
          cy.get("#source-explorer").within ->
            cy.contains("Carcassonne (Refresh)")


  context "refreshing the active source", ->
    beforeEach ->
      # stub Google API calls in this test
      cy.fixture("sources").then (sources) ->
        cy.window().its("googleSheets").then (googleSheets) ->
          llV2 = sources.loveLetter
          llV2.name = "Love Letter V2"
          cy.stub(googleSheets, "fetchSheetById").returns(Promise.resolve(llV2))

      cy.loadSourcesIntoVuex()

      cy.get("#source-manager")
        .contains("Love Letter Revisited")
        .click()

    it "prompts with diff before overwrite"

    it "overwrites the data if accepted", ->
      cy.get("#source-manager").within ->
        cy.contains("refresh")
          .click(force: true)

        # new version has been loaded
        cy.contains("Love Letter V2")


    it "leaves the data if declined"
