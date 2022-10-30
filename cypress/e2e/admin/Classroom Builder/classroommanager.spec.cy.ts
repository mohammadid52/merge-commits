/// <reference types="cypress" />

import {loginConfig, urlConfig} from '../../config';
import {getClientKey, getDictionary} from '../../../support/e2e';

const instituteId = 'f3aef681-6fff-4795-8fde-67cb159bd275';
const classroomUrl = `http://localhost:8085/dashboard/manage-institutions/institution/${instituteId}/class-rooms`;
const studentName = 'Jasperooo Prague';
const sucessMessage = 'Student added successfully';
const deleteMessage = 'Student removed from classroom';
const studentConfig = {
  email: 'jasperprague@yopmail.com',
  password: 'panda123'
};
const userLanguage = 'EN';
// @ts-ignore
const {Institute_info} = getDictionary(getClientKey());
const notebookLink = Institute_info[userLanguage]['TABS']['NOTEBOOK'];
const courseName = 'Big Bang Course Testing';

const loadClassroomPage = () => {
  cy.login(loginConfig.admin.username, loginConfig.admin.password);

  cy.wait(10000); // Wait for user to login
  cy.url().should('contain', urlConfig.dashboardURL);

  cy.visit(classroomUrl);
  cy.wait(10000); // Wait for page to load
  cy.dataCy('edit-classroom').first().click();
  cy.dataCy('classroom-builder-step-1').click();
};

const logout = () => {
  cy.dataCy('dropdown-button').click(); // Click on profile dropdown
  cy.dataCy('logout-button').click(); // Logout
};

describe('Classroom Manager', {defaultCommandTimeout: 20000}, () => {
  it('Student should be added to classroom', () => {
    loadClassroomPage();
    cy.wait(3000);
    cy.dataCy('edit-class-button').click();
    cy.dataCy('edit-class-input').clear().type(studentName);
    cy.dataCy('edit-class-item-0').click();
    cy.wait(3000);
    cy.dataCy('edit-class-add-button').click();
    cy.wait(2000);
    cy.get('p')
      .invoke('text')
      .then((text) => {
        expect(text).includes(sucessMessage);
      });
    cy.get('div')
      .invoke('text')
      .then((text) => {
        expect(text).includes(studentName);
      });
    logout();
    cy.login(studentConfig.email, studentConfig.password);
    cy.wait(10000); // Wait for user to login
    cy.url().should('contain', urlConfig.dashboardURL);
    cy.wait(5000); // wait for page to load
    cy.get('body').then((body) => {
      if (body.find('[data-cy="emoji-feedback-button"]').length > 0) {
        cy.dataCy('emoji-feedback-button').click(); // If emoji feedback popup is open click on save button
      }
    });
    cy.get(`button:contains(${notebookLink})`).click(); // Click on Notebook button in header
    cy.wait(3000); // Wait for notebooks to load
    cy.get('div')
      .invoke('text')
      .then((text) => {
        expect(text).includes(courseName);
      });
    logout();
    loadClassroomPage();
    // cy.wait(5000);
    // cy.dataCy('delete-user-5-button').click();
    // cy.dataCy('edit-class-delete-student-modal').click();
    // cy.get('p')
    //   .invoke('text')
    //   .then((text) => {
    //     expect(text).includes(sucessMessage);
    //   });
  });
});
