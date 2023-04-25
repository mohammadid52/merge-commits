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
      navMenuClick(button: string, item: string): Chainable<Element>;
      controlledInputChange(value: string | number): Chainable<Element>;
      hoverOnMenuItems(dropdownCy: string, items: string[]): Chainable<Element>;
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
  cy.dataCy('login-button').click();
  cy.dataCy('password').type(pw);
  cy.dataCy('login-button').click();
});

Cypress.Commands.add('closeCheckInModal', () => {
  try {
    cy.dataCy('sentiment-modal-close').click();
  } catch (error) {
    console.log('trying to close modal. but its already closed for today');
  }
});

Cypress.Commands.add('hoverOnMenuItems', (dropdownCy: string, items: string[]) => {
  cy.dataCy(dropdownCy).trigger('mouseover');
  items &&
    items.length > 0 &&
    items.forEach((menuItem) => {
      cy.dataCy(dropdownCy).trigger('mouseover');
      cy.wait(5000);
      cy.dataCy(menuItem).click();
    });
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
    const changeInputValue = (
      inputToChange: JQuery<HTMLElement> | {dispatchEvent: (arg0: Event) => void}[]
    ) => (newValue: any) => {
      // @ts-ignore
      nativeInputValueSetter.call(inputToChange[0], newValue);
      // @ts-ignore
      inputToChange[0].dispatchEvent(new Event('change', {newValue, bubbles: true}));
    };
    return cy.get(input).then((input) => changeInputValue(input)(value));
  }
);

Cypress.Commands.add('navMenuClick', (button, item) => {
  cy.get(`button:contains(${button})`).trigger('mouseover');
  cy.dataCy(item).click();
});
