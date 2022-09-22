/// <reference types="cypress" />

// test cred
const studentEmail = 'demostudent@zoiq.io';
const teacherEmail = 'demoteacher@zoiq.io';
const adminEmail = 'demoadmin@zoiq.io';
const testPass = 'admin123';
const failPass = 'admin@12';
const dashboardURL = 'http://localhost:8085/dashboard';
const loginURL = 'http://localhost:8085/login';
const loginErrorMessage = 'The email or password you entered was not correct';

describe(
  'Should Login',
  {
    defaultCommandTimeout: 20000
  },
  () => {
    it('Successfull login as student', function () {
      cy.visit('http://localhost:8085').get('p').contains('Verify Email');

      cy.get('input[placeholder="Email"]').type(studentEmail);
      cy.get('button').contains('Enter').click();
      cy.get('p').contains('Log In');
      cy.get('input[placeholder="Password"]').type(testPass);
      cy.get('button').contains('Login').click();
      cy.url().should('contain', dashboardURL);
    });

    it(
      'Successfull login as teacher',
      {
        defaultCommandTimeout: 20000
      },
      function () {
        cy.visit('http://localhost:8085').get('p').contains('Verify Email');

        cy.get('input[placeholder="Email"]').type(teacherEmail);
        cy.get('button').contains('Enter').click();
        cy.get('p').contains('Log In');
        cy.get('input[placeholder="Password"]').type(testPass);
        cy.get('button').contains('Login').click();
        cy.url().should('contain', dashboardURL);
      }
    );

    it(
      'Successfull login as admin',
      {
        defaultCommandTimeout: 20000
      },
      function () {
        cy.visit('http://localhost:8085').get('p').contains('Verify Email');

        cy.get('input[placeholder="Email"]').type(adminEmail);
        cy.get('button').contains('Enter').click();
        cy.get('p').contains('Log In');
        cy.get('input[placeholder="Password"]').type(testPass);
        cy.get('button').contains('Login').click();
        cy.url().should('contain', dashboardURL);
      }
    );
  }
);

describe(
  'Should not Login',
  {
    defaultCommandTimeout: 10000
  },
  () => {
    it('Fail login as student', function () {
      cy.visit('http://localhost:8085').get('p').contains('Verify Email');

      cy.get('input[placeholder="Email"]').type(studentEmail);
      cy.get('button').contains('Enter').click();
      cy.get('input[placeholder="Password"]').type(failPass);
      cy.get('button').contains('Login').click();
      cy.get('p').should('contain', loginErrorMessage);
    });

    it(
      'Fail login as teacher',
      {
        defaultCommandTimeout: 10000
      },
      function () {
        cy.visit('http://localhost:8085').get('p').contains('Verify Email');

        cy.get('input[placeholder="Email"]').type(teacherEmail);
        cy.get('button').contains('Enter').click();
        cy.get('input[placeholder="Password"]').type(failPass);
        cy.get('button').contains('Login').click();
        cy.get('p').should('contain', loginErrorMessage);
      }
    );

    it(
      'Fail login as admin',
      {
        defaultCommandTimeout: 10000
      },
      function () {
        cy.visit('http://localhost:8085').get('p').contains('Verify Email');

        cy.get('input[placeholder="Email"]').type(adminEmail);
        cy.get('button').contains('Enter').click();
        cy.get('input[placeholder="Password"]').type(failPass);
        cy.get('button').contains('Login').click();
        cy.get('p').should('contain', loginErrorMessage);
      }
    );
  }
);
