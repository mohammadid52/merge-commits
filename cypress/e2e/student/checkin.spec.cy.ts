/// <reference types="cypress" />

import {getClientKey, getDictionary} from '../../support/e2e';
import {loginConfig, urlConfig} from '../config';

const userLanguage = 'EN';
// @ts-ignore
const {Institute_info} = getDictionary(getClientKey());
const notebookLink = Institute_info[userLanguage]['TABS']['NOTEBOOK'];
const notebookPasscode = 'admin123';
const backstoryText = 'Added a backstory using cypress';

describe('Student Check In', () => {
  beforeEach(() => {
    cy.login(loginConfig.student.username, loginConfig.student.password);
  });

  it('Should check in and out sucessfully', {defaultCommandTimeout: 20000}, function () {
    cy.url().should('contain', urlConfig.dashboardURL); // Check if it is on the dashboard
    cy.wait(5000); // wait for page to load
    cy.get('body').then((body) => {
      if (body.find('[data-cy="emoji-feedback-button"]').length > 0) {
        cy.dataCy('emoji-feedback-button').click(); // If emoji feedback popup is open click on save button
      }
    });
    cy.get(`button:contains(${notebookLink})`).click(); // Click on Notebook button in header
    cy.wait(3000); // Wait for notebooks to load
    // cy.closeCheckInModal(); // Close the modal
    cy.dataCy('room-view-card').eq(1).click(); // Select the first notebook
    cy.dataCy('notebook-passcode-input').clear().type(notebookPasscode); // Enter passcode
    cy.dataCy('notebook-passcode-submit').click(); // Submit passcode
    cy.dataCy('sentiment-emoji').first().click(); // Click on first Sentiment emoji
    cy.dataCy('backstory-input').clear().type(backstoryText); // Type in the backstory input
    cy.dataCy('backstory-button').click(); // Click on the button to submit backstory
    cy.dataCy('dropdown-button').click(); // Click on profile dropdown
    cy.dataCy('logout-button').click(); // Logout
    cy.login(loginConfig.student.username, loginConfig.student.password); // Login again
    cy.dataCy('emoji-feedback-button').should('not.exist'); // Emoji feedback should not appear
  });
});
