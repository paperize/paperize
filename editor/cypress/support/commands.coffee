# You can read more about custom commands here:
# https://on.cypress.io/api/commands
Cypress.addParentCommand "typeIntoSelectors", (inputTextPairs) ->
  cy.wrap(inputTextPairs).then (selectorsAndText) ->
    for key in Object.keys selectorsAndText
      cy.get(key).type(selectorsAndText[key])

    return null
