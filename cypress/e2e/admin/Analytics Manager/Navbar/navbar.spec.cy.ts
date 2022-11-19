// This test is to ensure that all required fields are on the registration form and the cognito connection is active.

import {loginConfig, urlConfig} from '../../../config';

const dropdownDetail = {
  button: 'Analytics Manager',
  item: 'Download-CSV-item',
  item2: 'Upload-CSV-item'
};

describe('Navbar flow', () => {
  beforeEach(() => {
    cy.log('Login as admin');
    cy.login(loginConfig.admin.username, loginConfig.admin.password);
  });

  it(
    'Use Navbar Links for Analytics Manager',
    {defaultCommandTimeout: 20000},
    function () {
      cy.log('Wait for page to load');
      cy.wait(10000); // wait for page to load
      cy.log('Check if it is on the dashboard');
      cy.url().should('contain', urlConfig.dashboardURL);
      cy.log('Wait for page to load');
      cy.wait(10000);
      cy.log('Go to Analytics Manager through navbar');
      cy.navMenuClick(dropdownDetail.button, dropdownDetail.item);
      cy.log('Check if it is on the expected page');
      cy.url().should('contain', 'research-and-analytics');

      cy.log('Go to second link through navbar');
      cy.navMenuClick(dropdownDetail.button, dropdownDetail.item2);
      cy.log('Check if it is on the expected page');
      cy.url().should('contain', 'upload-csv');
    }
  );
});
