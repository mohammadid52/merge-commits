/// <reference types="cypress" />

import {loginConfig, urlConfig} from '../config';

const resetPasswordConfig = {
  oldPass: 'admin123',
  newPass: 'admin123'
};

const userName = 'cypressclassroom';
const resetMessage = 'Password reset successfully';
const userId = 'ca21e3f7-c2e5-44cb-9e00-1ca783422bb5';
const baseUrl = 'http://localhost:8085/dashboard/manage-institutions/institution';
const adminId = 'f3aef681-6fff-4795-8fde-67cb159bd275';
const registryUrl = `${baseUrl}/${adminId}/manage-users`;
const userUrl = `${baseUrl}/${adminId}/manage-users/${userId}`;

describe('Reset Password', () => {
  it('From Student', () => {
    cy.visit(urlConfig.baseURL); // Go to production website of IA
    cy.get('[data-cy="email"]').type(loginConfig.student.username); // Enter email
    cy.dataCy('login-button').click(); // Click on button
    cy.get('[data-cy="password"]').type(loginConfig.student.password); // Enter password
    cy.dataCy('login-button').click(); // Click on login button

    cy.wait(10000); // Wait for user to login
    cy.url().should('contain', urlConfig.dashboardURL);
    cy.get('body').then((body) => {
      if (body.find('[data-cy="emoji-feedback-card"]').length > 0) {
        cy.dataCy('emoji-feedback-card').first().click(); // If emoji feedback popup is open click on save button
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

  it('From Admin', () => {
    cy.visit(urlConfig.baseURL); // Go to production website of IA
    cy.get('[data-cy="email"]').type(loginConfig.admin.username); // Enter email
    cy.dataCy('login-button').click(); // Click on button
    cy.get('[data-cy="password"]').type(loginConfig.admin.password); // Enter password
    cy.dataCy('login-button').click(); // Click on login button

    cy.wait(10000); // Wait for user to login
    cy.url().should('contain', urlConfig.dashboardURL);

    cy.visit(registryUrl); // go to registry page
    cy.wait(10000); // Wait
    cy.dataCy('user-loookup-search').clear().type(`${userName}{enter}`); // search for user

    cy.visit(userUrl); // go to user page
    cy.wait(10000); // Wait
    cy.dataCy('reset-password-button').click(); // click reset password button
    cy.get(`div:contains(${resetMessage})`).should('exist'); // check password reset message
    cy.get('button:contains("Ok")').click(); // click ok on password reset message

    cy.dataCy('dropdown-button').click(); // Click on profile dropdown
    cy.dataCy('logout-button').click(); // Logout

    cy.visit(urlConfig.baseURL); // go to login page
    cy.dataCy('email').type(loginConfig.student.username); // Enter email
    cy.dataCy('login-button').click(); // Click on enter button
    cy.dataCy('password').type(loginConfig.student.password); // Enter password
    cy.dataCy('set-password').click(); // Set password

    cy.wait(10000); // Wait
    cy.url().should('contain', urlConfig.dashboardURL); // Check if it is on dashboard
  });
});
