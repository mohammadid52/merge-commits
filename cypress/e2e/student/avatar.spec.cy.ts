/// <reference types="cypress" />

import {loginConfig, urlConfig} from '../config';

const filePath = 'cypress/fixtures/images/avatar1.png';

describe('Change Avatar', () => {
  it('Should change avatar sucessfully', () => {
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

    cy.get('input[type=file]').selectFile(filePath, {force: true});
    cy.dataCy('save-profile-image').click(); // click on save profile image button
    cy.dataCy('profile-image')
      .should('have.attr', 'src')
      .should('include', 'profile_image_'); // check if the image exists or not
  });
});
