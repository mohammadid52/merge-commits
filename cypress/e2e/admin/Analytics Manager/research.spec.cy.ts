// This test is to ensure that all required fields are on the registration form and the cognito connection is active.

import {loginConfig, urlConfig} from '../../config';

const dropdownDetail = {
  button: 'Analytics Manager',
  item: 'Download-CSV-item'
};

describe('Research and Analytics', () => {
  beforeEach(() => {
    cy.log('Login as admin');
    cy.login(loginConfig.admin.username, loginConfig.admin.password);
  });

  it('data should be visible', {defaultCommandTimeout: 20000}, function () {
    cy.log('Wait for page to load');
    cy.wait(10000); // wait for page to load
    cy.log('Check if it is on the dashboard');
    cy.url().should('contain', urlConfig.dashboardURL);
    cy.log('Wait for page to load');
    cy.wait(10000);
    cy.log('Go to Analytics Manager through navbar');
    cy.navMenuClick(dropdownDetail.button, dropdownDetail.item);
    // cy.log('Go to registration page');
    // cy.visit(urlConfig.analyticsURL);
    cy.log('Wait for classrooms to load');
    cy.wait(5000);
    cy.log('Click on classroom selector');
    cy.dataCy('analytics-classroom-button').click();
    cy.log('Click on the first item');
    cy.dataCy('analytics-classroom-item-3936fdc3-d36d-43db-b43e-75efa30ea8cc').click();

    cy.log('Wait for unit to load');
    cy.wait(5000);
    cy.log('Click on unit selector');
    cy.dataCy('analytics-unit-button').click();
    cy.log('Click on the first item');
    cy.dataCy('analytics-unit-item-1bc60136-42aa-4db8-a9f2-6dc0bf05cd43').click();

    cy.log('Wait for survey to load');
    cy.wait(5000);
    cy.log('Click on survey selector');
    cy.dataCy('analytics-survey-button').click();
    cy.log('Click on the first item');
    cy.dataCy('analytics-survey-item-7546b398-acea-440e-ad74-3c007922e2e2').click(); // click on first item
    cy.log('Table should exists');
    cy.get('table').should('exist'); // check if table exists
  });
});
