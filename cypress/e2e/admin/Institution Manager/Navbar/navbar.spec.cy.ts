// This test is to ensure that all required fields are on the registration form and the cognito connection is active.

import {loginConfig, urlConfig} from '../../../config';

const dropdownDetail = {
  button: 'Institution Manager',
  item: 'General-Information-item',
  item2: 'Staff-item',
  item3: 'User-Registry-item',
  item4: 'Register-New-User-item'
};

describe('Navbar flow', () => {
  beforeEach(() => {
    cy.log('Login as admin');
    cy.login(loginConfig.admin.username, loginConfig.admin.password);
  });

  it(
    'Use Navbar Links for Institution Manager',
    {defaultCommandTimeout: 20000},
    function () {
      cy.log('Wait for page to load');
      cy.wait(10000); // wait for page to load
      cy.log('Check if it is on the dashboard');
      cy.url().should('contain', urlConfig.dashboardURL);
      cy.log('Wait for page to load');
      cy.wait(10000);
      cy.log('Go to General Information through navbar');
      cy.navMenuClick(dropdownDetail.button, dropdownDetail.item);
      cy.log('Check if it is on the expected page');
      cy.url().should('contain', 'edit');

      cy.log('Go to Staff through navbar');
      cy.navMenuClick(dropdownDetail.button, dropdownDetail.item2);
      cy.log('Check if it is on the expected page');
      cy.url().should('contain', 'staff');

      cy.log('Go to User Registry through navbar');
      cy.navMenuClick(dropdownDetail.button, dropdownDetail.item3);
      cy.log('Check if it is on the expected page');
      cy.url().should('contain', 'manage-users');

      cy.log('Go to Register new user through navbar');
      cy.navMenuClick(dropdownDetail.button, dropdownDetail.item4);
      cy.log('Check if it is on the expected page');
      cy.url().should('contain', 'register-user');
    }
  );
});
