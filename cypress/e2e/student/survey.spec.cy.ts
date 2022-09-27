/// <reference types="cypress" />

import {ids, loginConfig, urlConfig} from '../config';

const simpleSurveyConfig = {
  inputs: [
    'input#ab94f893-c1b6-4330-b595-cd51a4560eeb',
    'input#fe6b4a36-2ef5-4522-b86e-d7baab2a3272'
  ],
  classroom_url: `${urlConfig.baseURL}/dashboard/classroom/${ids.classroomIDs[0]}`
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
  cy.get('[data-cy="classroom-cards"]').first().click();
  cy.get('[data-cy="survey-button"]').first().click(); // <== here check if the button label is "GO TO SURVEY"
};

describe('Survey should work', () => {
  beforeEach(() => {
    cy.visit(urlConfig.baseURL);
    cy.get('[data-cy="email"]').type(loginConfig.student.username);
    cy.get('button').contains('Enter').click();
    cy.get('[data-cy="password"]').type(loginConfig.student.password);
    cy.get('button').contains('Login').click();
  });

  // it('should go to survey', {defaultCommandTimeout: 20000}, function () {
  //   loadActiveRoomData();
  // });

  it('should complete simple survey', {defaultCommandTimeout: 20000}, function () {
    loadActiveRoomData();

    // make sure you are on first page.
    // cy.contains('Label 1').click();
    // cy.get('a > p').should('contain', 'Label 1');
    // cy.get('h3').should('contain', '17-3-2022 Test Survey');
    // cy.get('span').should('contain', 'Test explanation paragraph');
    // // click on quest1 tab
    cy.contains('quest1').click();
    // fill in first input
    cy.get(simpleSurveyConfig.inputs[0]).clear().type(firstInputData());
    cy.wait(3000); // wait for data to save
    // click on quest2 tab
    cy.contains('quest2').click();
    cy.get(simpleSurveyConfig.inputs[1]).clear().type(secondInputData()); // fill in second input
    cy.wait(3000); // wait for data to save
    cy.get('[data-cy="save-lesson"]').click(); // click on save button
  });

  it(
    'Should check if simple survey is saved',
    {defaultCommandTimeout: 20000},
    function () {
      loadActiveRoomData();

      // cy.get('a > p').should('contain', 'Label 1');
      // cy.get('h3').should('contain', '17-3-2022 Test Survey');
      // cy.get('span').should('contain', 'Test explanation paragraph');
      cy.contains('quest1').click();
      cy.get(simpleSurveyConfig.inputs[0]).should('have.value', firstInputData());
      cy.contains('quest2').click();
      cy.get(simpleSurveyConfig.inputs[1]).should('have.value', secondInputData());
    }
  );
});
