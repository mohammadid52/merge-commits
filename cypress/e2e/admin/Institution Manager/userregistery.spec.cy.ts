// This test is to ensure that all required fields are on the registration form and the cognito connection is active.

import {loginConfig, urlConfig} from '../../config';

const dropdownDetail = {
  button: 'Institution Manager',
  item: 'User-Registry-item'
};

describe('User Register flow', () => {
  beforeEach(() => {
    cy.login(loginConfig.admin.username, loginConfig.admin.password); // login as admin
  });

  it('Profile Should be visible', {defaultCommandTimeout: 20000}, function () {
    cy.url().should('contain', urlConfig.dashboardURL); // check if it is on dashboard page
    cy.log('Go to User Registry through navbar');
    cy.navMenuClick(dropdownDetail.button, dropdownDetail.item);
    cy.dataCy('b7cac388-8348-481b-931e-39a33e9f3ef3').click(); // click on John
    cy.wait(10000);
    cy.get('a')
      .invoke('text')
      .then((text) => {
        expect(text).includes('Personal Information');
      });
  });
});
