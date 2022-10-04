/// <reference types="cypress" />

import {getClientKey, getDictionary} from '../../support/e2e';
import {loginConfig, urlConfig} from '../config';

const userLanguage = 'EN';
// @ts-ignore
const {Institute_info} = getDictionary(getClientKey());
const notebookLink = Institute_info[userLanguage]['TABS']['NOTEBOOK'];
const notebookPasscode = 'admin123';

describe('Student Check In', () => {
  beforeEach(() => {
    cy.login(loginConfig.student.username, loginConfig.student.password);
  });

  it('Should check in and out sucessfully', {defaultCommandTimeout: 20000}, function () {
    cy.url().should('contain', urlConfig.dashboardURL);
    cy.get('body').then((body) => {
      if (body.find('[data-cy="emoji-feedback-button"]').length > 0) {
        cy.dataCy('emoji-feedback-button').click();
      }
    });
    cy.get(`button:contains(${notebookLink})`).click();
    cy.dataCy('room-view-card').first().click();
    cy.dataCy('notebook-passcode-input').clear().type(notebookPasscode);
    cy.dataCy('notebook-passcode-submit').click();
  });
});
