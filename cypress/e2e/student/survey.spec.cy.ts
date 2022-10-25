/// <reference types="cypress" />

import {ids, loginConfig, urlConfig} from '../config';

const surveyConfig = {
  domIds: [
    'ab94f893-c1b6-4330-b595-cd51a4560eeb',
    'fe6b4a36-2ef5-4522-b86e-d7baab2a3272'
  ],
  page: ['Intro', 'Testing', 'Goodbye'],
  classroom_url: `${urlConfig.dashboardURL}/classroom/${ids.classroomIDs[0]}`
};

const randomNumber = () => Math.floor(Math.random() * (10 - 1)) + 1;
const sliderValue = randomNumber();

const firstInputData = () => {
  return `cypress-${new Date().getDate()}`;
};

const secondInputData = () => {
  return `cypress-${new Date().getDay()}`;
};

const loadActiveRoomData = () => {
  cy.wait(10000);
  cy.url().should('contain', urlConfig.dashboardURL);
  // cy.get('body').then((body) => {
  //   expect(localStorage.getItem('room_info'))?.to.not.equal(null);
  // });
  // go to classroom page to load activeRoomData.. without this survey won't save data
  cy.get('h2').should('contain', 'Your Classrooms');
  cy.dataCy('classroom-cards').first().click();
  cy.dataCy('survey-button').eq(2).click(); // <== here check if the button label is "GO TO SURVEY"
};

describe('Survey should work', () => {
  beforeEach(() => {
    cy.login(loginConfig.student.username, loginConfig.student.password);
  });

  // it('should go to survey', {defaultCommandTimeout: 20000}, function () {
  //   loadActiveRoomData();
  // });

  it('should complete survey', {defaultCommandTimeout: 20000}, function () {
    loadActiveRoomData();

    cy.contains(`${surveyConfig.page[0]}`).click(); // Go to first page
    cy.get('input[type=range]').controlledInputChange(sliderValue); // Select from range slider
    cy.contains(surveyConfig.page[1]).click(); // Go to second page
    cy.get('input[type=checkbox]').first().check(); // Check the first checkbox
    cy.get('textarea').clear().type(firstInputData()); // Type in input field
    cy.contains(surveyConfig.page[2]).click(); // Go to third page
    cy.get('input[type=radio]').first().check({force: true}); // Check first radio button
    cy.get('textarea').clear().type(secondInputData()); // Type in input field
    cy.saveSurvey(); // Click on save button
  });

  it('Should check if survey is saved', {defaultCommandTimeout: 20000}, function () {
    loadActiveRoomData(); // Go to classroom page to load activeRoomData.. without this survey won't save data
    cy.contains(`${surveyConfig.page[0]}`).click(); // Go to first page
    cy.get('input[type=range]').should('have.value', sliderValue); // Check range slider
    cy.contains(surveyConfig.page[1]).click(); // Go to second page
    cy.get('input[type=checkbox]').first().should('be.checked'); // go to second page
    cy.get('textarea').should('have.value', firstInputData()); // type in input field
    cy.contains(surveyConfig.page[2]).click(); // Go to third page
    cy.get('input[type=radio]').first().should('be.checked'); // Click on first radio button
    cy.get('textarea').should('have.value', secondInputData()); // Type in input field
  });
});
