/// <reference types="cypress" />

import {urlConfig} from '../e2e/config';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       *  cy.login('test@email.com', 'testPassword')
       */
      login(email: string, pw: string, customURL?: string): Chainable<Element>;
      /**
       *  cy.dataCy('greeting')
       */
      dataCy(value: string): Chainable<Element>;
      closeCheckInModal(): Chainable<Element>;
      saveSurvey(): Chainable<Element>;
      controlledInputChange(value: string | number): Chainable<Element>;
    }
  }
}

// @ts-ignore
Cypress.Commands.add('dataCy', (value) => {
  return cy.get(`[data-cy=${value}]`);
});

Cypress.Commands.add('login', (email, pw, customURL = urlConfig.baseURL) => {
  cy.visit(customURL);
  cy.dataCy('email').type(email);
  cy.get('button').contains('Login').click();
  cy.dataCy('password').type(pw);
  cy.get('button').contains('Login').click();
});

Cypress.Commands.add('closeCheckInModal', () => {
  cy.dataCy('sentiment-modal-close').click();
});

Cypress.Commands.add('saveSurvey', () => {
  cy.dataCy('save-lesson').click();
});

Cypress.Commands.add(
  'controlledInputChange',
  // @ts-ignore
  {prevSubject: 'element'},
  (input: string, value: string) => {
    // @ts-ignore
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    ).set;
    const changeInputValue = (inputToChange) => (newValue) => {
      // @ts-ignore
      nativeInputValueSetter.call(inputToChange[0], newValue);
      // @ts-ignore
      inputToChange[0].dispatchEvent(new Event('change', {newValue, bubbles: true}));
    };
    return cy.get(input).then((input) => changeInputValue(input)(value));
  }
);
