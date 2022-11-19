// This test is to ensure that all required fields are on the registration form and the cognito connection is active.

import {loginConfig, urlConfig} from '../../../config';

const dropdownDetail = {
  button: 'Classroom Builder',
  item: 'Classroom-Manager-item'
};

describe('Navbar flow', () => {
  beforeEach(() => {
    cy.log('Login as admin');
    cy.login(loginConfig.admin.username, loginConfig.admin.password);
  });

  it(
    'Use Navbar Links for Classroom Builder',
    {defaultCommandTimeout: 20000},
    function () {
      cy.log('Wait for page to load');
      cy.wait(10000); // wait for page to load
      cy.log('Check if it is on the dashboard');
      cy.url().should('contain', urlConfig.dashboardURL);
      cy.log('Wait for page to load');
      cy.wait(10000);
      cy.log('Go to Classroom Manager through navbar');
      cy.navMenuClick(dropdownDetail.button, dropdownDetail.item);
      cy.log('Check if it is on the expected page');
      cy.url().should('contain', 'class-rooms');
    }
  );
});
