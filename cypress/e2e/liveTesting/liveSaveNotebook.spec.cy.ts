/// <reference types="cypress" />

import {getClientKey, getDictionary} from '../../support/e2e';
import {loginConfig, urlConfig} from '../config';

const userLanguage = 'EN';
// @ts-ignore
const {Institute_info} = getDictionary(getClientKey());

const classroomTitle = 'Iconoclast Artists';
const lessonTitle = 'I Write ';

const domIds = ['531eafe6-61aa-4c82-b056-247b14be3035'];
const productionUrl = 'https://iconoclast.selready.com';
const inputText = 'Here is my Poem';
const selectedOption =
  'I write for (choose a person that means a lot to you and why are they special)';

const notebookLink = Institute_info[userLanguage]['TABS']['NOTEBOOK'];
const classroomName = 'Iconoclast Artists';
const notebookTitle = 'Iconoclast Artists Notebooks';

const lessonConfig = {
  page: ['Create', 'Feedback'],
  lesson_url: `${productionUrl}/lesson/${domIds[0]}/0`
};

describe('Production Save Notebooks Check', () => {
  it('Check Lyrics for Marlon', {defaultCommandTimeout: 20000}, () => {
    cy.visit(urlConfig.IAProductionUrl); // go to production website of IA

    // ~~~~~~ login ~~~~~~ //
    cy.get('[data-cy="email"]').type(loginConfig.production.student1.username); // enter email as mike
    cy.get('button').contains('Enter').click(); // click on button
    cy.get('[data-cy="password"]').type(loginConfig.production.student1.password); // enter password
    cy.get('button').contains('Login').click(); // click on login button

    cy.url().should('contain', urlConfig.IADashboardUrl);
    cy.get('body').then((body) => {
      if (body.find('[data-cy="emoji-feedback-button"]').length > 0) {
        cy.dataCy('emoji-feedback-button').click(); // if emoji feedback popup is open click on save button
      }
    });

    // ~~~~~~ Go to Notebooks page and check if the New Notebook exists ~~~~~~ //
    cy.get(`button:contains(${notebookLink})`).click(); // click on Notebook button in header
    cy.wait(10000); // wait for notebooks to load
    cy.contains(classroomName).should('exist'); // check if the notebook exists

    // ~~~~~~ Fill the Lesson [Create] ~~~~~~ //
    cy.visit(urlConfig.IADashboardUrl);
    cy.dataCy('classroom-cards').contains(classroomTitle).click({force: true});
    cy.get(`h1:contains(${lessonTitle})`).should('exist');
    cy.visit(lessonConfig.lesson_url);
    cy.contains(`${lessonConfig.page[0]}`).click({force: true}); // go to Create page
    cy.wait(10000); // wait for 10s
    cy.get('input').first().clear().type(inputText); // type in the input
    cy.get('select').select(2); // select second example poem
    cy.get('.DraftEditor-root').first().should('not.have.text', '');
    // go to Feedback page
    cy.contains(`${lessonConfig.page[1]}`).click({force: true});
    cy.saveSurvey(); // click on save button

    // ~~~~~~ Go to Notebooks page ~~~~~~ //
    cy.get(`button:contains(${notebookLink})`).click(); // click on Notebook button in header
    cy.wait(10000); // wait for notebooks to load
    cy.dataCy('room-view-card').first().click(); // select the first notebook
    cy.get(`h2:contains("${notebookTitle}")`).should('exist'); // check if the notes box is loaded
    cy.get('button#Notes').click(); // select the second tab
    // Check if notes exist or not
    cy.get('.note')
      .invoke('text')
      .then((text) => {
        expect(text).not.equal('');
        expect(text).not.equal('[]');
      });
  });
});
