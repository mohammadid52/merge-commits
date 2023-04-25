/// <reference types="cypress" />

import {loginConfig, urlConfig} from '../config';

describe('Production Logins', () => {
  it('Login to production version of IA', () => {
    cy.visit(urlConfig.IAProductionUrl); // go to production website of IA
    cy.get('[data-cy="email"]').type(loginConfig.mike.username); // enter email as mike
    cy.dataCy('login-button').click(); // click on button
    cy.get('[data-cy="password"]').type(loginConfig.mike.password); // enter password
    cy.dataCy('login-button').click(); // click on login button
  });

  it('Login to production version of PC', () => {
    cy.visit(urlConfig.PCProductionUrl); // go to production website of PC
    cy.get('[data-cy="email"]').type(loginConfig.mike.username); // enter email as mike
    cy.dataCy('login-button').click(); // click on button
    cy.get('[data-cy="password"]').type(loginConfig.mike.password); // enter password
    cy.dataCy('login-button').click(); // click on login button
  });
});
