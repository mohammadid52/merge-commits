/// <reference types="cypress" />

import {loginConfig, urlConfig} from '../config';

const resetPasswordConfig = {
  oldPass: 'admin123',
  newPass: 'admin123'
};

describe('Reset Password', () => {
  it('For Student', () => {
    cy.visit(urlConfig.baseURL); // Go to production website of IA
    cy.get('[data-cy="email"]').type(loginConfig.student.username); // Enter email
    cy.get('button').contains('Enter').click(); // Click on button
    cy.get('[data-cy="password"]').type(loginConfig.student.password); // Enter password
    cy.get('button').contains('Login').click(); // Click on login button

    cy.wait(10000); // Wait for user to login
    cy.url().should('contain', urlConfig.dashboardURL);
    cy.get('body').then((body) => {
      if (body.find('[data-cy="emoji-feedback-button"]').length > 0) {
        cy.dataCy('emoji-feedback-button').click(); // If emoji feedback popup is open click on save button
      }
    });

    cy.dataCy('dropdown-button').click(); // Click on profile dropdown
    cy.dataCy('dropdown-item-profile').click(); // Click on edit profile dropdown button
    cy.wait(5000); // Wait for page to load
    cy.dataCy('edit-profile-button').click(); // Click on edit button
    cy.dataCy('edit-password-link').click(); // Click on edit password button
    cy.dataCy('old-password-input').clear().type(resetPasswordConfig.oldPass); // Enter old password
    cy.dataCy('new-password-input').clear().type(resetPasswordConfig.newPass); // Enter new password
    cy.dataCy('match-password-input').type(resetPasswordConfig.newPass); // Confirm new password
    cy.dataCy('change-password-save-button').click(); // Click on save button
    cy.dataCy('change-password-save-button').should('not.exist'); // Click on save button
  });

  it('For Admin', () => {
    cy.visit(urlConfig.baseURL); // Go to production website of IA
    cy.get('[data-cy="email"]').type(loginConfig.admin.username); // Enter email
    cy.get('button').contains('Enter').click(); // Click on button
    cy.get('[data-cy="password"]').type(loginConfig.admin.password); // Enter password
    cy.get('button').contains('Login').click(); // Click on login button

    cy.wait(10000); // Wait for user to login
    cy.url().should('contain', urlConfig.dashboardURL);

    cy.dataCy('dropdown-button').click(); // Click on profile dropdown
    cy.dataCy('dropdown-item-profile').click(); // Click on edit profile dropdown button
    cy.wait(5000); // Wait for page to load
    cy.dataCy('edit-profile-button').click(); // Click on edit button
    cy.dataCy('edit-password-link').click(); // Click on edit password button
    cy.dataCy('old-password-input').clear().type(resetPasswordConfig.oldPass); //Enter old password
    cy.dataCy('new-password-input').clear().type(resetPasswordConfig.newPass); // Enter new password
    cy.dataCy('match-password-input').type(resetPasswordConfig.newPass); // Confirm new password
    cy.dataCy('change-password-save-button').click(); // Click on save button
    cy.dataCy('change-password-save-button').should('not.exist'); // Click on save button
  });
});
