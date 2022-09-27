/// <reference types="cypress" />

import {loginConfig, urlConfig} from '../config';

describe('Student flow', () => {
  beforeEach(() => {
    cy.login(loginConfig.student.username, loginConfig.student.password);
  });

  it('should go to profile', {defaultCommandTimeout: 20000}, function () {
    cy.url().should('contain', urlConfig.dashboardURL);
    cy.dataCy('dropdown-button').click();
    cy.dataCy('dropdown-item-profile').click();
  });
});
