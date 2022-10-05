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

const firstInputData = () => {
  return `cypress-${new Date().getDate()}`;
};

const secondInputData = () => {
  return `cypress-${new Date().getDay()}`;
};

const loadActiveRoomData = () => {
  cy.url().should('contain', urlConfig.dashboardURL);
  // go to classroom page to load activeRoomData.. without this survey won't save data
  cy.get('h2').should('contain', 'Your Classrooms');
  cy.closeCheckInModal();
  cy.dataCy('classroom-cards').first().click();
  cy.dataCy('survey-button').first().click(); // <== here check if the button label is "GO TO SURVEY"
};

describe('Survey should work', () => {
  beforeEach(() => {
    cy.login(loginConfig.student.username, loginConfig.student.password);
  });

  it('should go to survey', {defaultCommandTimeout: 20000}, function () {
    loadActiveRoomData();
  });

  it('should complete survey', {defaultCommandTimeout: 20000}, function () {
    loadActiveRoomData();

    // go to first page
    cy.contains(`${surveyConfig.page[0]}`).click();
    // select from range slider
    cy.get('input[type=range]').invoke('val', 4).trigger('change');
    // go to second page
    cy.contains(surveyConfig.page[1]).click();
    cy.get('input[type=checkbox]').first().check();
    // type in input field
    cy.get('textarea').clear().type(firstInputData());
    // go to third page
    cy.contains(surveyConfig.page[2]).click();
    // check first radio button
    cy.get('input[type=radio]').first().check({force: true});
    // type in input field
    cy.get('textarea').clear().type(secondInputData());

    cy.saveSurvey(); // click on save button
  });

  it('Should check if survey is saved', {defaultCommandTimeout: 20000}, function () {
    loadActiveRoomData(); // go to classroom page to load activeRoomData.. without this survey won't save data
    // go to first page
    cy.contains(`${surveyConfig.page[0]}`).click();
    // check range slider
    cy.get('input[type=range]').should('have.value', 4);
    // go to second page
    cy.contains(surveyConfig.page[1]).click();
    cy.get('input[type=checkbox]').first().should('be.checked');
    // type in input field
    cy.get('textarea').should('have.value', firstInputData());
    // go to third page
    cy.contains(surveyConfig.page[2]).click();
    cy.get('input[type=radio]').first().should('be.checked');
    // type in input field
    cy.get('textarea').should('have.value', secondInputData());
  });
});
