/// <reference types="cypress" />

import {loginConfig, urlConfig} from '../../config';

const filePath = 'cypress/fixtures/images/avatar1.png';

describe('Change Avatar', () => {
  it('Should change avatar sucessfully', () => {
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

    cy.get('input[type=file]').selectFile(filePath, {force: true});
    cy.dataCy('save-profile-image').click(); // Click on save profile image button
    cy.dataCy('profile-image')
      .should('have.attr', 'src')
      .should('include', 'profile_image_'); // Check if the image exists or not
  });
});
