/// <reference types="cypress" />

import {loginConfig, urlConfig} from '../config';
import {RegistrationDict} from '../../../src/dictionary/dictionary.demo';

const uniqueId = Date.now().toString();
const userLanguage = 'EN';

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

const dropdownDetail = {
  title: 'Institution Manager',
  item: 'Register New User'
};

const newUserFields = {
  firstName: RegistrationDict[userLanguage]['firstName'],
  lastName: RegistrationDict[userLanguage]['lastName'],
  email: RegistrationDict[userLanguage]['email'],
  role: RegistrationDict[userLanguage]['role'],
  // roleButton: 'Choose One',
  roleItem: RegistrationDict[userLanguage]['roles']['st'],
  class: RegistrationDict[userLanguage]['class'],
  status: RegistrationDict[userLanguage]['status'],
  pace: RegistrationDict[userLanguage]['paceLabel']
};

const newUserCreateFields = {
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email',
  classButton: 'Choose One',
  classItem: 'Big Bang Classroom Testing',
  statusButton: 'Active',
  statusItem: 'Training',
  paceItem: 'self-paced',
  submitButton: 'Submit',
  successMessage: 'Succesfully registered'
};

describe('Student flow', () => {
  beforeEach(() => {
    cy.visit(urlConfig.baseURL);
    cy.dataCy('email').type(loginConfig.admin.username);
    cy.get('button').contains('Enter').click();

    cy.dataCy('password').type(loginConfig.admin.password);
    cy.dataCy('remember').click();
    cy.get('button').contains('Login').click();
  });

  // it('should go to register user page', {defaultCommandTimeout: 20000}, function () {
  //   cy.url().should('contain', urlConfig.dashboardURL);
  //   cy.get(`button:contains(${dropdownDetail.title})`).trigger('mouseover');
  //   cy.get(`body:contains(${dropdownDetail.item})`).should('exist');
  //   cy.visit(urlConfig.registerURL);
  // });

  it('should contain all fields', {defaultCommandTimeout: 20000}, function () {
    cy.url().should('contain', urlConfig.dashboardURL);
    cy.visit(urlConfig.registerURL);
    cy.get(`label:contains(${newUserFields.firstName})`).should('exist');
    cy.get(`label:contains(${newUserFields.lastName})`).should('exist');
    cy.get(`label:contains(${newUserFields.email})`).should('exist');
    cy.get(`label:contains(${newUserFields.role})`).should('exist');
    // cy.get(`button:contains(${newUserFields.roleButton})`).click();
    cy.dataCy('dropdown-button').click();
    // cy.get(`li:contains(${newUserFields.roleItem})`).click();
    cy.dataCy('dropdown-item-4').click();
    cy.get(`button').should('contain', ${newUserFields.roleItem}`);
    cy.get(`label:contains(${newUserFields.class})`).should('exist');
    cy.get(`label:contains(${newUserFields.status})`).should('exist');
    cy.get(`label:contains(${newUserFields.pace})`).should('exist');
  });

  // it('should register new user', {defaultCommandTimeout: 20000}, function () {
  //   cy.url().should('contain', urlConfig.dashboardURL);
  //   cy.visit(urlConfig.registerURL);
  //   cy.get(`input#${newUserCreateFields.firstName}`).type(randomDetails().firstName);
  //   cy.get(`input#${newUserCreateFields.lastName}`).type(randomDetails().lastName);
  //   cy.get(`input#${newUserCreateFields.email}`).type(randomDetails().email);
  //   cy.get(`button:contains(${newUserFields.roleButton})`).click();
  //   cy.get(`li:contains(${newUserFields.roleItem})`).click();
  //   cy.get(`button:contains(${newUserCreateFields.classButton})`).click();
  //   cy.get(`li:contains(${newUserCreateFields.classItem})`).click();
  //   cy.get(`button:contains(${newUserCreateFields.statusButton})`).click();
  //   cy.get(`li:contains(${newUserCreateFields.statusItem})`).click();
  //   cy.get(`input[name=${newUserCreateFields.paceItem}]`).click();
  //   cy.get(`button:contains(${newUserCreateFields.submitButton})`).click();
  //   cy.get(`p:contains(${newUserCreateFields.successMessage})`).should('exist');
  // });
});
