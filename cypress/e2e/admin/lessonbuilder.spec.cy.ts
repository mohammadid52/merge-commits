/// <reference types="cypress" />

import {loginConfig, urlConfig} from '../config';

const instituteId = 'f3aef681-6fff-4795-8fde-67cb159bd275';
const lessonId = '4e970227-3c10-4653-9cf5-e5278861914e';
const lessonUrl = `http://localhost:8085/dashboard/manage-institutions/institution/${instituteId}/lessons/${lessonId}`;
const lessonTitle = 'Lesson Card';
const imageCaption = 'Alice Walker - Texas Rang';
const summary = `High-level hammer out, so overcome key issues to meet key milestones, but we need this overall to be busier and more active let's circle back tomorrow. Let's unpack that later. Poop prethink feature creep, hit the ground running can you send me an invite? but knowledge is a power player-coach. Corporate synergy reaches out nail it down we are running out of runway we need to aspirationalise our offerings. `;

describe('Lesson Preview', () => {
  it('Preview should be visible', () => {
    cy.visit(urlConfig.baseURL); // Go to production website of IA
    cy.get('[data-cy="email"]').type(loginConfig.admin.username); // Enter email
    cy.get('button').contains('Enter').click(); // Click on button
    cy.get('[data-cy="password"]').type(loginConfig.admin.password); // Enter password
    cy.get('button').contains('Login').click(); // Click on login button

    cy.wait(10000); // Wait for user to login
    cy.url().should('contain', urlConfig.dashboardURL);

    cy.visit(lessonUrl);
    cy.wait(15000); // Wait for page to load
    cy.get(`h4:contains(${lessonTitle})`).should('exist');
    cy.dataCy('lesson-image-caption').clear().type(imageCaption);
    cy.dataCy('lesson-summary').clear().type(summary);
    cy.get('button:contains("Preview")').click();
    cy.get('h2')
      .invoke('text')
      .then((text) => {
        expect(text).includes(imageCaption);
      });
    cy.get('p')
      .invoke('text')
      .then((text) => {
        expect(text).includes(summary);
      });
  });
});
