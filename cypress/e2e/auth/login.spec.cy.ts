/// <reference types="cypress" />
describe('Should Login', () => {
  it('Should login', function () {
    cy.visit('http://localhost:8085').get('p').contains('Verify Email');
    cy.get('input[placeholder="Email"]').type('demoteacher@zoiq.io');
    cy.get('button').contains('Enter').click();
    cy.get('p').contains('Log In');
    cy.get('input[placeholder="Password"]').type('admin123');
    cy.get('button').contains('Login').click();
  });
});
