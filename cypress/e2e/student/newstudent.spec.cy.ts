/// <reference types="cypress" />

import {loginConfig, urlConfig} from '../config';

describe('Student flow', () => {
  beforeEach(() => {
    cy.login(loginConfig.student.username, loginConfig.student.password);
  });

  it('should go to profile', {defaultCommandTimeout: 20000}, function () {
    cy.url().should('contain', urlConfig.dashboardURL); // Check if it is on dashboard page
    cy.dataCy('dropdown-button').click(); // Click on profile dropdown
    cy.dataCy('dropdown-item-profile').click(); // Click on edit profile dropdown button
  });
});
