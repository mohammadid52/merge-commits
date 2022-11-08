// This test is to ensure that all required fields are on the registration form and the cognito connection is active.

import {loginConfig, urlConfig} from '../../config';

const dropdownDetail = {
  title: 'Analytics Manager',
  item: 'Download CSV'
};

describe('Research and Analytics', () => {
  beforeEach(() => {
    cy.login(loginConfig.admin.username, loginConfig.admin.password); // login as admin
  });

  it('', {defaultCommandTimeout: 20000}, function () {
    cy.wait(10000); // wait for page to load
    cy.url().should('contain', urlConfig.dashboardURL); // check if it is on dashboard page
    cy.wait(10000); // wait for page to load
    cy.get(`button:contains(${dropdownDetail.title})`).trigger('mouseover');
    cy.get(`body:contains(${dropdownDetail.item})`).should('exist');
    // cy.visit(urlConfig.analyticsURL); // go to registration page
    cy.wait(10000); // wait for page to load
    cy.dataCy('analytics-classroom-button').click(); // click on dropdown
    cy.dataCy('analytics-classroom-item-3956fdc3-d36d-43db-b43e-75efa30ea8cc').click(); // click on first item

    cy.wait(3000); // wait for data to load
    cy.dataCy('analytics-unit-button').click(); // click on dropdown
    cy.dataCy('analytics-unit-item-1bc60136-42aa-4db8-a9f2-6dc0bf05cd43').click(); // click on first item

    cy.wait(3000); // wait for data to load
    cy.dataCy('analytics-survey-button').click(); // click on dropdown
    cy.dataCy('analytics-survey-item-7546b398-acea-440e-ad74-3c007922e2e2').click(); // click on first item
    cy.get('table').should('exist'); // check if table exists
  });
});
