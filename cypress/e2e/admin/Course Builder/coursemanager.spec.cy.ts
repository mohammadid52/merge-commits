/// <reference types="cypress" />

import {loginConfig, urlConfig} from '../../config';

const dropdownDetail = {
  button: 'Course Builder',
  item: 'Course-Manager-item'
};

const instituteId = 'f3aef681-6fff-4795-8fde-67cb159bd275';
// const courseUrl = `http://localhost:8085/dashboard/manage-institutions/institution/${instituteId}/courses`;
const courseTitle = 'Big Bang Course Testing';

describe('Course Page', {defaultCommandTimeout: 20000}, () => {
  it('Courses should be visible', () => {
    cy.log('Login to the application');
    cy.visit(urlConfig.baseURL);
    cy.log('Enter email');
    cy.get('[data-cy="email"]').type(loginConfig.admin.username);
    cy.log('Click on login');
    cy.dataCy('login-button').click(); // Click on button
    cy.log('Enter Password');
    cy.get('[data-cy="password"]').type(loginConfig.admin.password); // Enter password
    cy.log('Click on login');
    cy.dataCy('login-button').click(); // Click on login button

    cy.log('Wait for page to load');
    cy.wait(10000);
    cy.log('Check if it is on the dashboard');
    cy.url().should('contain', urlConfig.dashboardURL);

    cy.log('Go to Course Manager through navbar');
    cy.navMenuClick(dropdownDetail.button, dropdownDetail.item);
    cy.log('Wait for page to load');
    cy.wait(10000);
    cy.log('Click on first curriculum');
    cy.dataCy('curriculum-Big-Bang-Course-Testing').click();
    cy.log('curriculum input to have expected value');
    cy.dataCy('curricular-name-input').should('have.value', courseTitle);
  });
});
