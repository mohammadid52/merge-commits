/// <reference types="cypress" />

import {loginConfig, urlConfig} from '../config';

const resetPasswordConfig = {
  oldPass: 'admin123',
  newPass: 'admin123'
};

describe('Reset Password', () => {
  it('For Student', () => {
    cy.visit(urlConfig.baseURL); // go to production website of IA
    cy.get('[data-cy="email"]').type(loginConfig.student.username); // enter email
    cy.get('button').contains('Enter').click(); // click on button
    cy.get('[data-cy="password"]').type(loginConfig.student.password); // enter password
    cy.get('button').contains('Login').click(); // click on login button

    cy.wait(10000); // wait for user to login
    cy.url().should('contain', urlConfig.dashboardURL);
    cy.get('body').then((body) => {
      if (body.find('[data-cy="emoji-feedback-button"]').length > 0) {
        cy.dataCy('emoji-feedback-button').click(); // if emoji feedback popup is open click on save button
      }
    });

    cy.dataCy('dropdown-button').click(); // click on profile dropdown
    cy.dataCy('dropdown-item-profile').click(); // click on edit profile dropdown button
    cy.wait(5000); // wait for page to load
    cy.dataCy('edit-profile-button').click(); // click on edit button
    cy.dataCy('edit-password-link').click(); // click on edit password button
    cy.dataCy('old-password-input').clear().type(resetPasswordConfig.oldPass); //enter old password
    cy.dataCy('new-password-input').clear().type(resetPasswordConfig.newPass); // enter new password
    cy.dataCy('match-password-input').type(resetPasswordConfig.newPass); // confirm new password
    cy.dataCy('change-password-save-button').click(); // click on save button
    cy.dataCy('change-password-save-button').should('not.exist'); // click on save button
  });

  it('For Admin', () => {
    cy.visit(urlConfig.baseURL); // go to production website of IA
    cy.get('[data-cy="email"]').type(loginConfig.admin.username); // enter email
    cy.get('button').contains('Enter').click(); // click on button
    cy.get('[data-cy="password"]').type(loginConfig.admin.password); // enter password
    cy.get('button').contains('Login').click(); // click on login button

    cy.wait(10000); // wait for user to login
    cy.url().should('contain', urlConfig.dashboardURL);

    cy.dataCy('dropdown-button').click(); // click on profile dropdown
    cy.dataCy('dropdown-item-profile').click(); // click on edit profile dropdown button
    cy.wait(5000); // wait for page to load
    cy.dataCy('edit-profile-button').click(); // click on edit button
    cy.dataCy('edit-password-link').click(); // click on edit password button
    cy.dataCy('old-password-input').clear().type(resetPasswordConfig.oldPass); //enter old password
    cy.dataCy('new-password-input').clear().type(resetPasswordConfig.newPass); // enter new password
    cy.dataCy('match-password-input').type(resetPasswordConfig.newPass); // confirm new password
    cy.dataCy('change-password-save-button').click(); // click on save button
    cy.dataCy('change-password-save-button').should('not.exist'); // click on save button
  });
});
