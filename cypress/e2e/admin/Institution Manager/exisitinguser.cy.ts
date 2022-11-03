// This test is to ensure that all required fields are on the registration form and the cognito connection is active.

import {loginConfig, urlConfig} from '../../config';
import {getClientKey, getDictionary} from '../../../support/e2e';

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

const newUserFields = {
  firstName: RegistrationDict[userLanguage]['firstname'],
  lastName: RegistrationDict[userLanguage]['lastname'],
  email: RegistrationDict[userLanguage]['email'],
  role: RegistrationDict[userLanguage]['role'],
  roleItem: RegistrationDict[userLanguage]['roles']['adm']
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
    cy.login(loginConfig.admin.username, loginConfig.admin.password); // login as admin
  });

  it('register existing user', {defaultCommandTimeout: 20000}, function () {
    cy.url().should('contain', urlConfig.dashboardURL); // check if it is on dashboard page
    cy.visit(urlConfig.registerURL); // go to registration page
    cy.wait(3000); // wait for page to load
    cy.get(`input#${newUserCreateFields.firstName}`)
      .type(randomDetails().firstName)
      .should('have.value', randomDetails().firstName); // type in first name input and check if it contains that value
    cy.get(`input#${newUserCreateFields.lastName}`)
      .type(randomDetails().lastName)
      .should('have.value', randomDetails().lastName); // type in last name input and check if it contains that value
    cy.get(`input#${newUserCreateFields.email}`)
      .type(randomDetails().email)
      .should('have.value', randomDetails().email); // type in email input and check if it contains that value
    cy.dataCy('dropdown-role').click(); // click on role dropdown
    cy.dataCy('dropdown-item-role-0').click(); // select first role in the dropdown
    cy.dataCy('dropdown-role').should('contain', `${newUserFields.roleItem}`); // check if it contains the selected role
    cy.get(`button:contains(${newUserCreateFields.submitButton})`).click(); // click on submit button
    cy.get(`li:contains(${newUserCreateFields.existemail})`).should('exist'); // check for error message as the user is already registered
  });
});
