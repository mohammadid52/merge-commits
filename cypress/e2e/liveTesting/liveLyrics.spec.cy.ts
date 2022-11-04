/// <reference types="cypress" />

import {loginConfig, urlConfig} from '../config';

const classroomTitle = 'Iconoclast Artists';
const lessonTitle = 'I Write ';

const domIds = ['531eafe6-61aa-4c82-b056-247b14be3035'];
const productionUrl = 'https://iconoclast.selready.com';

const lessonConfig = {
  page: ['Learn'],
  lesson_url: `${productionUrl}/lesson/${domIds[0]}/0`
};

describe('Production Lyrics Check', () => {
  it('Check Lyrics for Marlon', {defaultCommandTimeout: 20000}, () => {
    cy.visit(urlConfig.IAProductionUrl); // go to production website of IA
    cy.get('[data-cy="email"]').type(loginConfig.production.student1.username); // enter email as mike
    cy.dataCy('login-button').click(); // click on button
    cy.get('[data-cy="password"]').type(loginConfig.production.student1.password); // enter password
    cy.dataCy('login-button').click(); // click on login button

    cy.url().should('contain', urlConfig.IADashboardUrl);
    cy.get('body').then((body) => {
      if (body.find('[data-cy="emoji-feedback-button"]').length > 0) {
        cy.dataCy('emoji-feedback-button').click(); // if emoji feedback popup is open click on save button
      }
    });
    cy.dataCy('classroom-cards').contains(classroomTitle).click({force: true});
    cy.get(`h1:contains(${lessonTitle})`).should('exist');
    cy.visit(lessonConfig.lesson_url);
    // go to lesson page
    cy.contains(`${lessonConfig.page[0]}`).click();
    cy.get('.DraftEditor-root').first().should('not.have.text', '');
  });

  it('Check Lyrics for Angela', {defaultCommandTimeout: 20000}, () => {
    cy.visit(urlConfig.IAProductionUrl); // go to production website of IA
    cy.get('[data-cy="email"]').type(loginConfig.production.student2.username); // enter email as mike
    cy.dataCy('login-button').click(); // click on button
    cy.get('[data-cy="password"]').type(loginConfig.production.student2.password); // enter password
    cy.dataCy('login-button').click(); // click on login button

    cy.url().should('contain', urlConfig.IADashboardUrl);
    cy.get('body').then((body) => {
      if (body.find('[data-cy="emoji-feedback-button"]').length > 0) {
        cy.dataCy('emoji-feedback-button').click(); // if emoji feedback popup is open click on save button
      }
    });
    cy.dataCy('classroom-cards').contains(classroomTitle).click({force: true});
    cy.get(`h1:contains(${lessonTitle})`).should('exist');
    cy.visit(lessonConfig.lesson_url);
    // go to lesson page
    cy.contains(`${lessonConfig.page[0]}`).click();
    cy.get('.DraftEditor-root').eq(1).should('not.have.text', '');
  });
});
