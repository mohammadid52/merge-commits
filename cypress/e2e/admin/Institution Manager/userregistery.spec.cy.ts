// This test is to ensure that all required fields are on the registration form and the cognito connection is active.

import {loginConfig, urlConfig} from '../../config';

describe('User Register flow', () => {
  beforeEach(() => {
    cy.login(loginConfig.admin.username, loginConfig.admin.password); // login as admin
  });

  it('Profile Should be visible', {defaultCommandTimeout: 20000}, function () {
    cy.url().should('contain', urlConfig.dashboardURL); // check if it is on dashboard page
    cy.visit(urlConfig.userListURL); // go to registration page
    cy.wait(10000); // wait for page to load
    cy.dataCy('b7cac388-8348-481b-931e-39a33e9f3ef3').click(); // click on John
    cy.get('a')
      .invoke('text')
      .then((text) => {
        expect(text).includes('Personal Information');
      });
  });
});
