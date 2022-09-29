/// <reference types="cypress" />

import {loginConfig, urlConfig} from '../config';

const failPass = 'panda@12';
const loginErrorMessage = 'The email or password you entered was not correct';

describe(
  'Should Login',
  {
    defaultCommandTimeout: 20000
  },
  () => {
    it('Successfull login as student', function () {
      cy.login(loginConfig.student.username, loginConfig.student.password);
      cy.url().should('contain', urlConfig.dashboardURL);
    });

    it(
      'Successfull login as teacher',
      {
        defaultCommandTimeout: 20000
      },
      function () {
        cy.login(loginConfig.teacher.username, loginConfig.teacher.password);
        cy.url().should('contain', urlConfig.dashboardURL);
      }
    );

    it(
      'Successfull login as admin',
      {
        defaultCommandTimeout: 20000
      },
      function () {
        cy.login(loginConfig.admin.username, loginConfig.admin.password);
        cy.url().should('contain', urlConfig.dashboardURL);
      }
    );

    it(
      'Successfull login as self paced student',
      {
        defaultCommandTimeout: 20000
      },
      function () {
        cy.login(
          loginConfig.selfPacedStudent.username,
          loginConfig.selfPacedStudent.password
        );
        cy.url().should('contain', urlConfig.dashboardURL);
      }
    );

    it(
      'Successfull login as builder',
      {
        defaultCommandTimeout: 20000
      },
      function () {
        cy.login(loginConfig.builder.username, loginConfig.builder.password);
        cy.url().should('contain', urlConfig.dashboardURL);
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
      cy.login(loginConfig.student.username, failPass);
      cy.get('p').should('contain', loginErrorMessage);
    });

    it(
      'Fail login as teacher',
      {
        defaultCommandTimeout: 10000
      },
      function () {
        cy.login(loginConfig.teacher.username, failPass);
        cy.get('p').should('contain', loginErrorMessage);
      }
    );

    it(
      'Fail login as admin',
      {
        defaultCommandTimeout: 10000
      },
      function () {
        cy.login(loginConfig.admin.username, failPass);
        cy.get('p').should('contain', loginErrorMessage);
      }
    );
  }
);
