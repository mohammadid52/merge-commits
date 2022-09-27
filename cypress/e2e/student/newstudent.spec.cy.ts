/// <reference types="cypress" />

import {loginConfig, urlConfig} from '../config';

describe('Student flow', () => {
  beforeEach(() => {
    cy.visit(urlConfig.baseURL);
    cy.get('[data-cy="email"]').type(loginConfig.student.username);
    cy.get('button').contains('Enter').click();
    cy.get('[data-cy="password"]').type(loginConfig.student.password);
    cy.get('button').contains('Login').click();
  });

  it('should go to profile', {defaultCommandTimeout: 20000}, function () {
    cy.url().should('contain', urlConfig.dashboardURL);
    cy.get('[data-cy="dropdown-button"]').click();
    cy.get('[data-cy="dropdown-item-profile"]').click();
  });
});
