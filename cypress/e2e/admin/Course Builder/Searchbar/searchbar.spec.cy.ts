// This test is to ensure that all required fields are on the registration form and the cognito connection is active.

import {loginConfig, urlConfig} from '../../../config';

const curriculumName = 'Summer Bridge';
const unitName = 'Identity';
const lessonName = 'Short Stories';

const dropdownDetail = {
  button: 'Course Builder',
  item: 'Course-Manager-item',
  item2: 'Unit-Manager-item',
  item3: 'Lesson-Manager-item'
};

describe('Searchbar flow', () => {
  beforeEach(() => {
    cy.log('Login as admin');
    cy.login(loginConfig.admin.username, loginConfig.admin.password);
  });

  it('Use Searchbar for Course Builder', {defaultCommandTimeout: 20000}, function () {
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

    cy.log('Search for Curriculum');
    cy.dataCy('curriculum-search-input').clear().type(curriculumName);
    cy.get(`div:contains(${curriculumName})`).then((div) => {
      expect(div).to.be.visible;
    });

    cy.log('Go to Unit Manager through navbar');
    cy.navMenuClick(dropdownDetail.button, dropdownDetail.item2);
    cy.log('Check if it is on the expected page');
    cy.url().should('contain', 'units');

    cy.log('Search for Unit');
    cy.dataCy('unit-search-input').clear().type(unitName);
    cy.get(`div:contains(${unitName})`).then((div) => {
      expect(div).to.be.visible;
    });

    cy.log('Go to Lesson Manager through navbar');
    cy.navMenuClick(dropdownDetail.button, dropdownDetail.item3);
    cy.log('Check if it is on the expected page');
    cy.url().should('contain', 'lessons');

    cy.log('Search for Lesson');
    cy.dataCy('lesson-search-input').clear().type(lessonName);
    cy.get(`div:contains(${lessonName})`).then((div) => {
      expect(div).to.be.visible;
    });
  });
});
