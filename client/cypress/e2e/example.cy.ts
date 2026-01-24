// https://on.cypress.io/api

describe('My First Test', () => {
  it('Идём на страницу логина', () => {
    cy.visit('/auth/login')
    cy.contains('h5', 'cypress')
    cy.contains('h6', 'тест2')
  })
})


/**
import "cypress-localstorage-commands";

Cypress.Commands.add('login', () => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:3000/api/users/login',
    body: {
      user: {
        email: 'jake@jake.jake',
        password: 'jakejake',
      }
    }
  })
  .its('body')
  .then(body => {
    cy.setLocalStorage("jwt", body.user.token);
  })
});


before(() => {
  cy.login();
  cy.saveLocalStorage();
});

beforeEach(() => {
  cy.restoreLocalStorage();
});
*/
