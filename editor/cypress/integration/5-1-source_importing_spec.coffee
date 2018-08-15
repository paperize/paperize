Promise = require('bluebird')

describe "Importing Sources", ->
  beforeEach ->
    cy.loginAndEditGame()
    cy.contains("Instruction Book").click()

  context "by pasting a Google Sheet URL or ID", ->
    submitPaste = (paste) ->
      cy.get("input[name='source-paste']")
          .type(paste)

      cy.get("div[data-modal=source-paste-form]")
          .find(".button.success")
            .click()

    beforeEach ->
      cy.get(".button")
        .contains("Set a Source...")
        .click()

      cy.get("#source-manager")
        .contains("Paste a Link")
          .click()

      cy.get("div[data-modal=source-paste-form]")
          .should("be.visible")

    it "closes when i cancel", ->
      cy.get("div[data-modal=source-paste-form]")
          .find(".button.alert")
            .click()

      cy.get("div[data-modal=source-paste-form]")
          .should("not.be.visible")

    it "errors when ID can't be parsed", ->
      submitPaste("abcd1234")

      cy.contains("Error: No Google Sheet ID detected in \"abcd1234\"")

    it "shows a spinner if google never responds", ->
      cy.window().its("auth").then (auth) ->
        cy.stub(auth, 'getClient').callsArgWith(0, {
          sheets: {
            spreadsheets: {
              get: ->
                then: (callback, errback) ->
                  # never call back

              values: {
                get: -> # never call back
              }
            }
          },
          drive: {
            files: {
              get: ->
                then: (callback, errback) ->
                  # never call back
            }
          }
        })

      submitPaste("xxxxxxxxxxxxxxxxxxxxxxxxx")

      cy.contains("Talking to Google...")

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

        cy.get("div[data-modal=source-paste-form]")
            .find(".button.success")
              .click()

      it "closes", ->
        cy.get("div[data-modal=source-paste-form]")
            .should("not.be.visible")

      it "i see i have the new source selected", ->
        cy.contains('Love Letter Revisited')

  context "by browsing my Google Sheets", ->
    beforeEach ->
      # stub Google API calls in this test
      @fetchSheetsPromiseResolve = null
      @fetchSheetsPromise = new Promise (resolve) =>
        @fetchSheetsPromiseResolve = resolve
      cy.fixture("sources").then (sources) =>
        cy.window().its("googleSheets").then (googleSheets) =>
          cy.stub(googleSheets, "fetchSheets").returns(@fetchSheetsPromise)
          cy.stub(googleSheets, "fetchSheetById").resolves(sources.loveLetter)


    beforeEach ->
      cy.get(".button")
        .contains("Set a Source...")
        .click()

      cy.get("#source-manager")
        .contains("Browse Google Sheets")
          .click()

      cy.get("div[data-modal='source-explorer']")
          .should("be.visible")

    it "has a title and call-to-action", ->
      cy.get("div[data-modal='source-explorer']").within ->
        cy.contains("Browse Your Google Sheets")
        cy.get('a.button').contains("Fetch Sheet Listing...")

    describe "fetching sources the first time", ->
      beforeEach ->
        cy.contains("Fetch Sheet Listing...")
            .click()

      it "hides the call-to-action and shows a spinner", ->
        cy.contains("Fetch Sheet Listing...").should("not.be.visible")
        cy.contains("Talking to Google...")

      it "hides the spinner", ->
        @fetchSheetsPromiseResolve([])
        cy.contains("Talking to Google...").should("not.be.visible")

      context "lists new sources", ->
        beforeEach ->
          cy.vuexAndFixtures ({ vuex, fixtures: { sources }}) ->
            # 2 come back from google
            @fetchSheetsPromiseResolve([sources.carcassonne, sources.loveLetter])
            # 1 is already in the store
            vuex.commit("setSources", { carcassonne: sources.carcassonne })

        it "adds new sources", ->
          cy.get("div[data-modal='source-explorer']").within ->
            cy.contains("Love Letter Revisited (Add)")

        it "refreshes existing sources", ->
          cy.get("div[data-modal='source-explorer']").within ->
            cy.contains("Carcassonne (Refresh)")

    describe "re-fetching sources", ->
      beforeEach ->
        cy.vuexAndFixtures ({ vuex, fixtures: { sources }}) ->
          vuex.commit("setRemoteSources", [sources.carcassonne, sources.loveLetter])
          vuex.commit("setSources", { carcassonne: sources.carcassonne })

        cy.contains("Refresh Sheet Listing...")
          .click()

      it "hides call-to-action and shows spinner", ->
        cy.contains("Refresh Sheet Listing...").should("not.be.visible")
        cy.contains("Talking to Google...")

      it "hides the spinner", ->
        @fetchSheetsPromiseResolve([])
        cy.contains("Talking to Google...").should("not.be.visible")

      it "replaces the remote source list", ->
        cy.vuexAndFixtures ({ vuex, fixtures: { sources }}) ->
          # 2 come back from google
          @fetchSheetsPromiseResolve([sources.loveLetter, sources.pandemic])

        cy.get("div[data-modal='source-explorer']").within ->
          cy.contains("Carcassonne").should("not.be.visible")
          cy.contains("Love Letter Revisited (Add)")
          cy.contains("Pandemic")


  context "refreshing the active source", ->
    beforeEach ->
      # stub Google API calls in this test
      cy.fixture("sources").then (sources) ->
        cy.window().its("googleSheets").then (googleSheets) ->
          llV2 = sources.loveLetter
          llV2.name = "Love Letter V2"
          cy.stub(googleSheets, "fetchSheetById").returns(Promise.resolve(llV2))

      cy.loadSourcesIntoVuex()

      cy.get(".button")
        .contains("Set a Source...")
        .click()

      cy.get("#source-manager .set-source")
        .first()
        .click()

    it "prompts with diff before overwrite"

    it "overwrites the data if accepted", ->
      cy.get("#source-editor .button")
        .contains("Edit")
        .click()

      cy.get("#source-manager").within ->
        cy.contains("Refresh Now")
          .click()

        # new version has been loaded
        cy.contains("Love Letter V2")


    it "leaves the data if declined"
