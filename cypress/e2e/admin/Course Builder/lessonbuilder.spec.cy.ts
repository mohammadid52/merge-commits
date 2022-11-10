/// <reference types="cypress" />

import {loginConfig, urlConfig} from '../../config';

const instituteId = 'f3aef681-6fff-4795-8fde-67cb159bd275';
const lessonId = '4e970227-3c10-4653-9cf5-e5278861914e';
const lessonUrl = `http://localhost:8085/dashboard/manage-institutions/institution/${instituteId}/lessons/${lessonId}`;
const lessonTitle = 'Lesson Card';
const imageCaption = 'Alice Walker - Texas Rang';
const summary = `High-level hammer out, so overcome key issues to meet key milestones, but we need this overall to be busier and more active let's circle back tomorrow. Let's unpack that later. Poop prethink feature creep, hit the ground running can you send me an invite? but knowledge is a power player-coach. Corporate synergy reaches out nail it down we are running out of runway we need to aspirationalise our offerings. `;

describe('Lesson Preview', () => {
  it('Preview should be visible', () => {
    cy.log('Login to the application');
    cy.visit(urlConfig.baseURL); // Go to production website of IA
    cy.log('Enter email');
    cy.get('[data-cy="email"]').type(loginConfig.admin.username); // Enter email
    cy.log('Click on login');
    cy.dataCy('login-button').click(); // Click on button
    cy.log('Enter Password');
    cy.get('[data-cy="password"]').type(loginConfig.admin.password); // Enter password
    cy.log('Click on login');
    cy.dataCy('login-button').click(); // Click on login button

    cy.log('Wait for page to load');
    cy.wait(10000);
    cy.log('Check if it is on the dashboard');
    cy.url().should('contain', urlConfig.dashboardURL);

    cy.log('Go to lesson page');
    cy.visit(lessonUrl);
    cy.log('Wait for page to load');
    cy.wait(15000);
    cy.log('Lesson title should be visible');
    cy.get(`h4:contains(${lessonTitle})`).should('exist');
    cy.log('Type image caption');
    cy.dataCy('lesson-image-caption').clear().type(imageCaption);
    cy.log('Type Lesson Summary');
    cy.dataCy('lesson-summary').clear().type(summary);
    cy.log('Click on preview');
    cy.get('button:contains("Preview")').click();
    cy.log('Check if image caption is visible');
    cy.get('h2')
      .invoke('text')
      .then((text) => {
        expect(text).includes(imageCaption);
      });
    cy.log('Check if summary is visible');
    cy.get('p')
      .invoke('text')
      .then((text) => {
        expect(text).includes(summary);
      });
  });
});
