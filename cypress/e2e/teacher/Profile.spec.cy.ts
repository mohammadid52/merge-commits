/// <reference types="cypress" />

import {loginConfig, urlConfig} from '../config';

describe('Should work profile page', () => {
  beforeEach(() => {
    cy.login(loginConfig.teacher.username, loginConfig.teacher.password);
  });

  it('should go to profile page', {defaultCommandTimeout: 20000}, function () {
    cy.url().should('contain', urlConfig.dashboardURL);
    cy.dataCy('dropdown-button').click();
    cy.dataCy('dropdown-item-profile').click();
  });
});
