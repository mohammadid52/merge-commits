/// <reference types="cypress" />

describe('Production Logins', () => {
  it('Login to production version of IA', () => {
    cy.visit('https://iconoclast.selready.com/login');
    cy.get('[data-cy="email"]').type('michael.russell@zoiq.io');
    cy.get('button').contains('Enter').click();
    cy.get('[data-cy="password"]').type('admin123');
    cy.get('button').contains('Login').click();
  });

  it('Login to production version of PC', () => {
    cy.visit('https://projectcurate.zoiq.io/login');
    cy.get('[data-cy="email"]').type('michael.russell@zoiq.io');
    cy.get('button').contains('Enter').click();
    cy.get('[data-cy="password"]').type('admin123');
    cy.get('button').contains('Login').click();
  });
});
