/// <reference types="cypress" />

import {loginConfig, urlConfig} from '../config';

const uniqueId = Date.now().toString();

const randomDetails = () => {
  const firstName = `cypress-${uniqueId}`;
  const lastName = ` test`;
  const email = `${firstName}@yopmail.com`;
  return {
    firstName,
    lastName,
    email
  };
};

describe('Student flow', () => {
  beforeEach(() => {
    cy.visit(urlConfig.baseURL);
    cy.get('[data-cy="email"]').type(loginConfig.admin.username);
    cy.get('button').contains('Enter').click();

    cy.get('[data-cy="password"]').type(loginConfig.admin.password);
    cy.get('[data-cy="remember"]').click();
    cy.get('button').contains('Login').click();
  });

  it('should go to register user page', {defaultCommandTimeout: 20000}, function () {
    cy.url().should('contain', urlConfig.dashboardURL);
    cy.get('button:contains("Institution Manager")').trigger('mouseover');
    cy.get('body:contains("Register New User")').should('exist');
    cy.visit(urlConfig.registerURL);
  });

  it('should contain all fields', {defaultCommandTimeout: 20000}, function () {
    cy.url().should('contain', urlConfig.dashboardURL);
    cy.visit(urlConfig.registerURL);
    cy.get('label:contains("First Name")').should('exist');
    cy.get('label:contains("Last Name")').should('exist');
    cy.get('label:contains("Email")').should('exist');
    cy.get('label:contains("Role")').should('exist');
    cy.get('button:contains("Choose One")').click();
    cy.get('li:contains("Student")').click();
    cy.get('button').should('contain', 'Student');
    cy.get('label:contains("Class")').should('exist');
    cy.get('label:contains("Status")').should('exist');
    cy.get('label:contains("Choose Pace")').should('exist');
  });

  it('should register new user', {defaultCommandTimeout: 20000}, function () {
    cy.url().should('contain', urlConfig.dashboardURL);
    cy.visit(urlConfig.registerURL);
    cy.get('input#firstName').type(randomDetails().firstName);
    cy.get('input#lastName').type(randomDetails().lastName);
    cy.get('input#email').type(randomDetails().email);
    cy.get('button:contains("Choose One")').click();
    cy.get('li:contains("Student")').click();
    cy.get('button:contains("Choose One")').click();
    cy.get('li:contains("Big Bang Classroom Testing")').click();
    cy.get('button:contains("Active")').click();
    cy.get('li:contains("Training")').click();
    cy.get('input[name="self-paced"]').click();
    cy.get('button:contains("Submit")').click();
    cy.get('p:contains("Succesfully registered")').should('exist');
  });
});
