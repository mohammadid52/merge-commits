/// <reference types="cypress" />

// test cred
const studentEmail = 'jasperprague@yopmail.com';
const teacherEmail = 'testuser2023@yopmail.com';
const adminEmail = 'michael.russell@zoiq.io';
const testPass = 'panda123';
const failPass = 'panda@12';
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
      cy.visit('http://localhost:8085');

      cy.get('[data-cy="email"]').type(studentEmail);
      cy.get('button').contains('Enter').click();
      cy.get('[data-cy="password"]').type(testPass);
      cy.get('[data-cy="remember"]').click();
      cy.get('button').contains('Login').click();
      cy.url().should('contain', dashboardURL);
    });

    it(
      'Successfull login as teacher',
      {
        defaultCommandTimeout: 20000
      },
      function () {
        cy.visit('http://localhost:8085');

        cy.get('[data-cy="email"]').type(teacherEmail);
        cy.get('button').contains('Enter').click();
        cy.get('[data-cy="password"]').type(testPass);
        cy.get('[data-cy="remember"]').click();
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
        cy.visit('http://localhost:8085');

        cy.get('[data-cy="email"]').type(adminEmail);
        cy.get('button').contains('Enter').click();
        cy.get('[data-cy="password"]').type(testPass);
        cy.get('[data-cy="remember"]').click();
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
      cy.visit('http://localhost:8085');

      cy.get('[data-cy="email"]').type(studentEmail);
      cy.get('button').contains('Enter').click();
      cy.get('[data-cy="password"]').type(failPass);
      cy.get('button').contains('Login').click();
      cy.get('p').should('contain', loginErrorMessage);
    });

    it(
      'Fail login as teacher',
      {
        defaultCommandTimeout: 10000
      },
      function () {
        cy.visit('http://localhost:8085');

        cy.get('[data-cy="email"]').type(teacherEmail);
        cy.get('button').contains('Enter').click();
        cy.get('[data-cy="password"]').type(failPass);
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
        cy.visit('http://localhost:8085');

        cy.get('[data-cy="email"]').type(adminEmail);
        cy.get('button').contains('Enter').click();
        cy.get('[data-cy="password"]').type(failPass);
        cy.get('button').contains('Login').click();
        cy.get('p').should('contain', loginErrorMessage);
      }
    );
  }
);
