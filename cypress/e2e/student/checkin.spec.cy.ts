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
    cy.url().should('contain', urlConfig.dashboardURL); // check if it is on the dashboard
    cy.get('body').then((body) => {
      if (body.find('[data-cy="emoji-feedback-button"]').length > 0) {
        cy.dataCy('emoji-feedback-button').click(); // if emoji feedback popup is open click on save button
      }
    });
    cy.get(`button:contains(${notebookLink})`).click(); // click on Notebook button in header
    cy.wait(3000); // wait for notebooks to load
    // cy.closeCheckInModal(); // close the modal
    cy.dataCy('room-view-card').first().click(); // select the first notebook
    cy.dataCy('notebook-passcode-input').clear().type(notebookPasscode); // enter passcode
    cy.dataCy('notebook-passcode-submit').click(); // submit passcode
    cy.dataCy('sentiment-emoji').first().click(); // click on first Sentiment emoji
    cy.dataCy('backstory-input').clear().type(backstoryText); // type in the backstory input
    cy.dataCy('backstory-button').click(); // click on the button to submit backstory
    cy.dataCy('dropdown-button').click(); // click on profile dropdown
    cy.dataCy('logout-button').click(); // logout
    cy.login(loginConfig.student.username, loginConfig.student.password); // login again
    cy.dataCy('emoji-feedback-button').should('not.exist'); // emoji feedback should not appear
  });
});
