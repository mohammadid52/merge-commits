// This test is to ensure that all required fields are on the registration form and the cognito connection is active.

import {loginConfig, urlConfig} from '../../../config';

const studentName = 'Claudia Crane';
const studentName2 = 'Adam';

const dropdownDetail = {
  button: 'Institution Manager',
  item: 'User-Registry-item'
};

describe('Searchbar flow', () => {
  beforeEach(() => {
    cy.log('Login as admin');
    cy.login(loginConfig.admin.username, loginConfig.admin.password);
  });

  it(
    'Use Searchbar for Institution Manager',
    {defaultCommandTimeout: 20000},
    function () {
      cy.log('Wait for page to load');
      cy.wait(10000); // wait for page to load
      cy.log('Check if it is on the dashboard');
      cy.url().should('contain', urlConfig.dashboardURL);
      cy.log('Wait for page to load');
      cy.wait(10000);

      cy.log('Search for claudia');
      cy.dataCy('staff-loookup-search').clear().type(studentName);
      cy.get(`span:contains(${studentName})`).then((span) => {
        expect(span).to.be.visible;
      });

      cy.log('Go to User Registry through navbar');
      cy.navMenuClick(dropdownDetail.button, dropdownDetail.item);
      cy.log('Check if it is on the expected page');
      cy.url().should('contain', 'manage-users');

      cy.log('Search for Adam');
      cy.dataCy('user-loookup-search').clear().type(studentName2);
      cy.get(`span:contains(${studentName2})`).then((span) => {
        expect(span).to.be.visible;
      });
    }
  );
});
