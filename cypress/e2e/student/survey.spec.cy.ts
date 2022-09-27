/// <reference types="cypress" />

const email = 'jasperprague@yopmail.com';
const pass = 'panda123';
const url = 'http://localhost:8085/dashboard/';
const surveyUrl =
  'http://localhost:8085/lesson/de824abb-3f1a-422d-a0f1-002d85de6ccd/0http://localhost:8085/lesson/de824abb-3f1a-422d-a0f1-002d85de6ccd/0';

const firstInputData = () => {
  return `cypress-${new Date().getDate()}`;
};

const secondInputData = () => {
  return `cypress-${new Date().getDay()}`;
};

describe('Survey should work', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8085');
    cy.get('[data-cy="email"]').type(email);
    cy.get('button').contains('Enter').click();
    cy.get('[data-cy="password"]').type(pass);
    cy.get('button').contains('Login').click();
  });

  it('should go to survey', {defaultCommandTimeout: 20000}, function () {
    cy.url().should('contain', url);
    cy.get('h2').should('contain', 'Your Classrooms');
    cy.get('[data-cy="classroom-cards"]').first().click();
    cy.get('[data-cy="survey-button"]').first().click();
  });

  it('should complete simple survey', {defaultCommandTimeout: 20000}, function () {
    cy.url().should('contain', url);
    cy.visit(surveyUrl);
    cy.get('a > p').should('contain', 'Label 1');
    cy.get('h3').should('contain', '17-3-2022 Test Survey');
    cy.get('span').should('contain', 'Test explanation paragraph');
    cy.contains('quest1').click();
    cy.get('input#ab94f893-c1b6-4330-b595-cd51a4560eeb').type(firstInputData());
    cy.contains('quest2').click();
    cy.get('input#fe6b4a36-2ef5-4522-b86e-d7baab2a3272').type(secondInputData());
    cy.get('[data-cy="save-lesson"]').click();
  });

  it(
    'Should check if simple survey is saved',
    {defaultCommandTimeout: 20000},
    function () {
      cy.url().should('contain', url);
      cy.visit(surveyUrl);
      cy.contains('quest1').click();
      cy.get('input#ab94f893-c1b6-4330-b595-cd51a4560eeb').should(
        'have.value',
        firstInputData()
      );
      cy.contains('quest2').click();
      cy.get('input#fe6b4a36-2ef5-4522-b86e-d7baab2a3272').should(
        'have.value',
        secondInputData()
      );
    }
  );
});
