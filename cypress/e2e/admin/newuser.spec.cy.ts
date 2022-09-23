/// <reference types="cypress" />

const email = 'demoadmin@zoiq.io';
const pass = 'admin123';
const url = 'http://localhost:8085/dashboard';

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
    cy.visit('http://localhost:8085');
    cy.get('input[placeholder="Email"]').type(email);
    cy.get('button').contains('Enter').click();
    cy.get('input[placeholder="Password"]').type(pass);
    cy.get('button').contains('Login').click();
  });

  it('should go to register user page', {defaultCommandTimeout: 20000}, function () {
    cy.url().should('contain', url);
    // cy.get('button').find('Institution Manager').click();
    cy.get('button:contains("Institution Manager")').trigger('mouseover');
    cy.get('body:contains("Register New User")').should('exist');
    cy.visit(
      'http://localhost:8085/dashboard/manage-institutions/institution/6539589f-44d2-4749-b0ba-87086b7fe1d8/register-user'
    );
  });

  it('should contain all fields', {defaultCommandTimeout: 20000}, function () {
    cy.url().should('contain', url);
    cy.visit(
      'http://localhost:8085/dashboard/manage-institutions/institution/6539589f-44d2-4749-b0ba-87086b7fe1d8/register-user'
    );
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
    cy.url().should('contain', url);
    cy.visit(
      'http://localhost:8085/dashboard/manage-institutions/institution/6539589f-44d2-4749-b0ba-87086b7fe1d8/register-user'
    );
    cy.get('input#firstName').type(randomDetails().firstName);
    cy.get('input#lastName').type(randomDetails().lastName);
    cy.get('input#email').type(randomDetails().email);
    cy.get('button:contains("Choose One")').click();
    cy.get('li:contains("Student")').click();
    cy.get('button:contains("Choose One")').click();
    cy.get('li:contains("Summer Bridge Aldine 3")').click();
    cy.get('button:contains("Active")').click();
    cy.get('li:contains("Training")').click();
    cy.get('input[name="self-paced"]').click();
    cy.get('button:contains("Submit")').click();
    cy.get('p:contains("Succesfully registered")').should('exist');
  });
});
