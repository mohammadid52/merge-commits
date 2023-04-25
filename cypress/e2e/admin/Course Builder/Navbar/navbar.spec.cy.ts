// This test is to ensure that all required fields are on the registration form and the cognito connection is active.

import {loginConfig, urlConfig} from '../../../config';

const dropdownDetail = {
  button: 'Course Builder',
  item: 'Course-Manager-item',
  item2: 'Unit-Manager-item',
  item3: 'Lesson-Manager-item',
  item4: 'Game-Changers-item'
};

describe('Navbar flow', () => {
  beforeEach(() => {
    cy.log('Login as admin');
    cy.login(loginConfig.admin.username, loginConfig.admin.password);
  });

  it('Use Navbar Links for Course Builder', {defaultCommandTimeout: 20000}, function () {
    cy.log('Wait for page to load');
    cy.wait(10000); // wait for page to load
    cy.log('Check if it is on the dashboard');
    cy.url().should('contain', urlConfig.dashboardURL);
    cy.log('Wait for page to load');
    cy.wait(10000);
    cy.log('Go to Course Manager through navbar');
    cy.navMenuClick(dropdownDetail.button, dropdownDetail.item);
    cy.log('Check if it is on the expected page');
    cy.url().should('contain', 'courses');

    cy.log('Go to Unit Manager through navbar');
    cy.navMenuClick(dropdownDetail.button, dropdownDetail.item2);
    cy.log('Check if it is on the expected page');
    cy.url().should('contain', 'units');

    cy.log('Go to Lesson Manager through navbar');
    cy.navMenuClick(dropdownDetail.button, dropdownDetail.item3);
    cy.log('Check if it is on the expected page');
    cy.url().should('contain', 'lessons');

    cy.log('Go to Game Changers through navbar');
    cy.navMenuClick(dropdownDetail.button, dropdownDetail.item4);
    cy.log('Check if it is on the expected page');
    cy.url().should('contain', 'game-changers');
  });
});
