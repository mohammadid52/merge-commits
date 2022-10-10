/// <reference types="cypress" />

import {loginConfig, urlConfig} from '../config';

const resetPasswordConfig = {
  oldPass: 'admin123',
  newPass: 'admin123'
};

describe('Reset Password', () => {
  it('For Student', () => {
    cy.visit(urlConfig.IAProductionUrl); // go to production website of IA
    cy.get('[data-cy="email"]').type(loginConfig.production.student3.username); // enter email
    cy.get('button').contains('Enter').click(); // click on button
    cy.get('[data-cy="password"]').type(loginConfig.production.student3.password); // enter password
    cy.get('button').contains('Login').click(); // click on login button

    cy.wait(10000); // wait for user to login
    cy.url().should('contain', urlConfig.IADashboardUrl);
    cy.get('body').then((body) => {
      if (body.find('[data-cy="emoji-feedback-button"]').length > 0) {
        cy.dataCy('emoji-feedback-button').click(); // if emoji feedback popup is open click on save button
      }
    });

    // TODO: Change selectors with data-cy attributes [Blocker: graphql for uatenv not working]
    cy.dataCy('dropdown-button').click(); // click on profile dropdown
    cy.dataCy('dropdown-item-profile').click(); // click on edit profile dropdown button
    cy.get(`button:contains('Edit')`).click(); // click on edit button
    cy.get(`a:contains('Click here to edit password')`).click(); //click on edit password button
    cy.get('input#oldPassword').clear().type(resetPasswordConfig.oldPass); //enter old password
    cy.get('input#newPassword').clear().type(resetPasswordConfig.newPass); // enter new password
    cy.get('input#match').clear().type(resetPasswordConfig.newPass); // confirm new password
    cy.get(`button:contains('Save New Password')`).click(); // click on save button
    cy.get(`button:contains('Save New Password')`).should('not.exist'); // click on save button
  });

  it('For Admin', () => {
    cy.visit(urlConfig.IAProductionUrl); // go to production website of IA
    cy.get('[data-cy="email"]').type(loginConfig.mike.username); // enter email
    cy.get('button').contains('Enter').click(); // click on button
    cy.get('[data-cy="password"]').type(loginConfig.mike.password); // enter password
    cy.get('button').contains('Login').click(); // click on login button

    cy.wait(10000); // wait for user to login
    cy.url().should('contain', urlConfig.IADashboardUrl);

    // TODO: Change selectors with data-cy attributes [Blocker: graphql for uatenv not working]
    cy.dataCy('dropdown-button').click(); // click on profile dropdown
    cy.dataCy('dropdown-item-profile').click(); // click on edit profile dropdown button
    cy.get(`button:contains('Edit')`).click(); // click on edit button
    cy.get(`a:contains('Click here to edit password')`).click(); //click on edit password button
    cy.get('input#oldPassword').clear().type(resetPasswordConfig.oldPass); //enter old password
    cy.get('input#newPassword').clear().type(resetPasswordConfig.newPass); // enter new password
    cy.get('input#match').clear().type(resetPasswordConfig.newPass); // confirm new password
    cy.get(`button:contains('Save New Password')`).click(); // click on save button
    cy.get(`button:contains('Save New Password')`).should('not.exist'); // click on save button
  });
});
