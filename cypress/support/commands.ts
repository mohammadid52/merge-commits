/// <reference types="cypress" />

import {urlConfig} from '../e2e/config';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       *  cy.login('test@email.com', 'testPassword')
       */
      login(email: string, pw: string): Chainable<Element>;
      /**
       *  cy.dataCy('greeting')
       */
      dataCy(value: string): Chainable<Element>;
    }
  }
}

// @ts-ignore
Cypress.Commands.add('dataCy', (value) => {
  return cy.get(`[data-cy=${value}]`);
});

Cypress.Commands.add('login', (email, pw) => {
  cy.visit(urlConfig.baseURL);
  cy.dataCy('email').type(email);
  cy.get('button').contains('Enter').click();
  cy.dataCy('password').type(pw);
  cy.get('button').contains('Login').click();
});
