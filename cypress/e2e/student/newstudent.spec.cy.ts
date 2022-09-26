/// <reference types="cypress" />

const email = 'demostudent@zoiq.io';
const pass = 'admin123';
const url = 'http://localhost:8085/dashboard/home';

describe('Student flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8085');
    cy.get('[data-cy="email"]').type(email);
    cy.get('button').contains('Enter').click();
    cy.get('[data-cy="password"]').type(pass);
    cy.get('button').contains('Login').click();
  });

  it('should go to profile', {defaultCommandTimeout: 20000}, function () {
    cy.url().should('contain', url);
    cy.get('[data-cy="dropdown-button"]').click();
    cy.get('[data-cy="dropdown-item-profile"]').click();
  });
});
