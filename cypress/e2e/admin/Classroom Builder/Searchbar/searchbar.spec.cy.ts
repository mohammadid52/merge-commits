// This test is to ensure that all required fields are on the registration form and the cognito connection is active.

import {loginConfig, urlConfig} from '../../../config';

const instName = 'Baylor College of Medicine (BCM), United States of America (USA)';
const instClassroom = 'Medi classroom 1';

const dropdownDetail = {
  button: 'Classroom Builder',
  item: 'Classroom-Manager-item'
};

describe('Searchbar flow', () => {
  beforeEach(() => {
    cy.log('Login as admin');
    cy.login(loginConfig.admin.username, loginConfig.admin.password);
  });

  it('Use Searchbar for Classroom Builder', {defaultCommandTimeout: 20000}, function () {
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

    cy.log('Select Institution');
    cy.dataCy('classroom-institution-button').click();
    cy.dataCy('classroom-institution-item-d995bb46-46c1-4f13-b003-1d4e4aa8737a').click();
    cy.get(`td:contains(${instName})`).then((td) => {
      expect(td).to.be.visible;
    });

    cy.log('Search for Institute Classroom');
    cy.dataCy('classroom-search-input').clear().type(`${instClassroom}{enter}`);
    cy.get(`td:contains(${instClassroom})`).then((td) => {
      expect(td).to.exist;
    });

    cy.dataCy('clear-selector').click();

    cy.log('Search for Institute');
    cy.dataCy('classroom-search-input').clear().type(`${instName}{enter}`);
    cy.get(`td:contains(${instName})`).then((td) => {
      expect(td).to.visible;
    });
  });
});
