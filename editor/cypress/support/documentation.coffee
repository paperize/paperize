
Cypress.Commands.add "paperizeDocs", (documentName, elementToHighlight) ->
  cy.get(elementToHighlight).within (element) ->
    element[0].style.boxShadow = "0 0 0 99999px rgba(0, 0, 0, .8)"
    element[0].style.zIndex = 100

  cy.screenshot(documentName)
