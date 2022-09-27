/// <reference types="cypress" />

const email = 'testuser2023@yopmail.com';
const pass = 'panda123';
const url = 'http://localhost:8085/dashboard';

describe('Should work profile page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8085');
    cy.get('[data-cy="email"]').type(email);
    cy.get('button').contains('Enter').click();
    cy.get('[data-cy="password"]').type(pass);
    cy.get('button').contains('Login').click();
  });

  it('should go to profile page', {defaultCommandTimeout: 20000}, function () {
    cy.url().should('contain', url);
    cy.get('[data-cy="dropdown-button"]').click();
    cy.get('[data-cy="dropdown-item-profile"]').click();
  });
});
