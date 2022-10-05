// This test is to ensure that all required fields are on the registration form and the cognito connection is active. 


import {loginConfig, urlConfig} from '../config';
// import {RegistrationDict} from '../../../src/dictionary/dictionary.demo';
import {getClientKey, getDictionary} from '../../support/e2e';

const uniqueId = Date.now().toString();
// @ts-ignore
const {RegistrationDict} = getDictionary(getClientKey());
const userLanguage = 'EN';

const randomDetails = () => {
  const firstName = `cypress-${uniqueId}`;
  const lastName = ` test`;
  const email = `michael.russell@zoiq.io`;
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
  firstName: RegistrationDict[userLanguage]['firstname'],
  lastName: RegistrationDict[userLanguage]['lastname'],
  email: RegistrationDict[userLanguage]['email'],
  role: RegistrationDict[userLanguage]['role'],
  // roleButton: 'Choose One',
  roleItem: RegistrationDict[userLanguage]['roles']['adm'],
//   class: RegistrationDict[userLanguage]['class'],
//   status: RegistrationDict[userLanguage]['status'],
//   pace: RegistrationDict[userLanguage]['paceLabel']
};

const newUserCreateFields = {
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email',
  submitButton: 'Submit',
  existemail: 'An account with this email exists'
};

describe('Student flow', () => {
  beforeEach(() => {
    cy.login(loginConfig.admin.username, loginConfig.admin.password);
   });



  it('register existing user', {defaultCommandTimeout: 20000}, function () {
    cy.url().should('contain', urlConfig.dashboardURL);
    cy.visit(urlConfig.registerURL);
    cy.wait(3000);
    cy.get(`input#${newUserCreateFields.firstName}`)
      .type(randomDetails().firstName)
      .should('have.value', randomDetails().firstName);
    cy.get(`input#${newUserCreateFields.lastName}`)
      .type(randomDetails().lastName)
      .should('have.value', randomDetails().lastName);
    cy.get(`input#${newUserCreateFields.email}`)
      .type(randomDetails().email)
      .should('have.value', randomDetails().email);
    cy.dataCy('dropdown-role').click();
    cy.dataCy('dropdown-item-role-0').click();
    cy.dataCy('dropdown-role').should('contain', `${newUserFields.roleItem}`);
    cy.get(`button:contains(${newUserCreateFields.submitButton})`).click();
    cy.get(`p:contains(${newUserCreateFields.existemail})`).should('exist');
  });

});

