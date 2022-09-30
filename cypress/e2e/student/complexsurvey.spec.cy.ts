/// <reference types="cypress" />

import {ids, loginConfig, urlConfig} from '../config';

const complexSurveyConfig = {};

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
  cy.dataCy('classroom-cards').first().click(); // <== here click on the first classroom card
  cy.dataCy('survey-button').eq(2).click(); // <== here click on the Go To Survey button
};

describe('Complex Survey should work', () => {
  beforeEach(() => {
    cy.login(loginConfig.student.username, loginConfig.student.password);
  });

  it('should go to compex survey', {defaultCommandTimeout: 20000}, function () {
    loadActiveRoomData();
  });

  it('should complete complex survey', {defaultCommandTimeout: 20000}, function () {
    loadActiveRoomData();
  });

  it(
    'Should check if complex survey is saved',
    {defaultCommandTimeout: 20000},
    function () {
      loadActiveRoomData(); // go to classroom page to load activeRoomData.. without this survey won't save data
    }
  );
});
