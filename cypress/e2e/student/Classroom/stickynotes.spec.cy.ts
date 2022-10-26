/// <reference types="cypress" />

import {ids, loginConfig, urlConfig} from '../../config';

const lessonId = '405b09eb-dfd1-4024-a8d0-16dc96d60844';
const lessonConfig = {
  page: ['Notes'],
  lesson_url: `${urlConfig.baseURL}/lesson/${lessonId}/0`
};

const firstInputData = 'The book was on the table.';

const secondInputData = () => {
  return `cypress-${new Date().getDay()}`;
};

const loadActiveRoomData = () => {
  cy.wait(10000);
  cy.url().should('contain', urlConfig.dashboardURL);
  // go to classroom page to load activeRoomData.. without this survey won't save data
  cy.get('h2').should('contain', 'Your Classrooms');
  cy.get('body').then((body) => {
    if (body.find('[data-cy="emoji-feedback-button"]').length > 0) {
      cy.dataCy('emoji-feedback-button').click(); // If emoji feedback popup is open click on save button
    }
  });
  cy.dataCy('classroom-cards').first().click({force: true});
  cy.visit(lessonConfig.lesson_url);
};

describe('Sticky Notes should work', () => {
  beforeEach(() => {
    cy.login(loginConfig.student.username, loginConfig.student.password);
  });

  it('Should update Sticky notes', {defaultCommandTimeout: 20000}, function () {
    loadActiveRoomData();

    cy.contains(`${lessonConfig.page[0]}`).click({force: true}); // Go to first page
    cy.get('textarea')
      .eq(0)
      .invoke('text')
      .then((text) => {
        expect(text).includes(firstInputData); // verify first note to exist and have value
      });
    cy.dataCy('add-new-note-button').click();
    cy.get('textarea')
      .eq(1)
      .clear()
      .type(secondInputData())
      .should('have.value', secondInputData()); // Type in input field
    cy.dataCy('save-note-button').click();
    cy.saveSurvey(); // Click on save button
  });

  it(
    'Should check if sticky notes is saved',
    {defaultCommandTimeout: 20000},
    function () {
      loadActiveRoomData(); // Go to classroom page to load activeRoomData.. without this survey won't save data

      cy.wait(10000);
      cy.contains(`${lessonConfig.page[0]}`).click({force: true}); // Go to first page
      cy.get('textarea')
        .eq(0)
        .invoke('text')
        .then((text) => {
          expect(text).includes(firstInputData); // verify first note to exist and have value
        });

      cy.get('textarea').eq(1).should('have.value', secondInputData()); // Type in input field
      cy.dataCy('delete-sticky-note-button').eq(0).click();
      cy.dataCy('delete-note-button').click();
      cy.saveSurvey(); // Click on save button
    }
  );
});
