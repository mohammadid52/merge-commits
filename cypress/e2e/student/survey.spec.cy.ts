/// <reference types="cypress" />

import {ids, loginConfig, urlConfig} from '../config';

const simpleSurveyConfig = {
  domIds: [
    'ab94f893-c1b6-4330-b595-cd51a4560eeb',
    'fe6b4a36-2ef5-4522-b86e-d7baab2a3272'
  ],
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

  it('should complete simple survey', {defaultCommandTimeout: 20000}, function () {
    loadActiveRoomData();

    // // click on quest1 tab
    cy.contains('quest1').click();
    // fill in first input
    cy.dataCy(simpleSurveyConfig.domIds[0]).clear().type(firstInputData());
    cy.wait(3000); // wait for data to save
    // click on quest2 tab
    cy.contains('quest2').click();
    cy.dataCy(simpleSurveyConfig.domIds[1])
      .clear()
      .type(secondInputData(), {delay: 100})
      .wait(3000); // fill in second input

    cy.dataCy('save-lesson').click(); // click on save button
  });

  it(
    'Should check if simple survey is saved',
    {defaultCommandTimeout: 20000},
    function () {
      loadActiveRoomData(); // go to classroom page to load activeRoomData.. without this survey won't save data

      cy.contains('quest1').click(); // click on quest1 tab
      cy.dataCy(simpleSurveyConfig.domIds[0]).should('have.value', firstInputData()); // check if first input has correct value
      cy.contains('quest2').click(); // click on quest2 tab
      cy.dataCy(simpleSurveyConfig.domIds[1]).should('have.value', secondInputData()); // check if second input has correct value
    }
  );
});
