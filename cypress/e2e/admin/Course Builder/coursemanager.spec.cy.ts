/// <reference types="cypress" />

import {loginConfig, urlConfig} from '../../config';

const instituteId = 'f3aef681-6fff-4795-8fde-67cb159bd275';
const courseUrl = `http://localhost:8085/dashboard/manage-institutions/institution/${instituteId}/courses`;
const courseTitle = 'Big Bang Course Testing';

describe('Course Page', {defaultCommandTimeout: 20000}, () => {
  it('Courses should be visible', () => {
    cy.visit(urlConfig.baseURL); // Go to production website of IA
    cy.get('[data-cy="email"]').type(loginConfig.admin.username); // Enter email
    cy.dataCy('login-button').click(); // Click on button
    cy.get('[data-cy="password"]').type(loginConfig.admin.password); // Enter password
    cy.dataCy('login-button').click(); // Click on login button

    cy.wait(10000); // Wait for user to login
    cy.url().should('contain', urlConfig.dashboardURL);

    cy.visit(courseUrl);
    cy.wait(10000); // Wait for page to load
    cy.dataCy('curriculum-Big-Bang-Course-Testing').click();
    cy.dataCy('curricular-name-input').should('have.value', courseTitle);
  });
});
