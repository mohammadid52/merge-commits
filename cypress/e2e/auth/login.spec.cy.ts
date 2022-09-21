/// <reference types="cypress" />

// test cred
const testEmail = 'demoteacher@zoiq.io';
const testPass = 'admin123';

describe('Should Login', () => {
  it('Should login', function () {
    cy.visit('http://localhost:8085').get('p').contains('Verify Email');

    cy.get('input[placeholder="Email"]').type(testEmail);
    cy.get('button').contains('Enter').click();
    cy.get('p').contains('Log In');
    cy.get('input[placeholder="Password"]').type(testPass);
    cy.get('button').contains('Login').click();
  });
});
