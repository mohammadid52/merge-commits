/// <reference types="cypress" />

import {loginConfig, urlConfig} from '../../config';
import {getClientKey, getDictionary} from '../../../support/e2e';

const dropdownDetail = {
  button: 'Classroom Builder',
  item: 'Classroom-Manager-item'
};

// const instituteId = 'f3aef681-6fff-4795-8fde-67cb159bd275';
// const classroomUrl = `http://localhost:8085/dashboard/manage-institutions/institution/${instituteId}/class-rooms`;
const studentName = 'Jasperooo Prague';
const sucessMessage = 'Student added successfully';
// const deleteMessage = 'Student removed from classroom';
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
  cy.log('Login as admin');
  cy.login(loginConfig.admin.username, loginConfig.admin.password);
  cy.log('Wait for page to load');
  cy.wait(10000);
  cy.log('Check if it is on the dashboard');
  cy.url().should('contain', urlConfig.dashboardURL);

  cy.log('Go to Classroom Manager through navbar');
  cy.navMenuClick(dropdownDetail.button, dropdownDetail.item);
  cy.log('Wait for page to load');
  cy.wait(10000);
  cy.log('Click on the classroom name');
  cy.dataCy('edit-classroom').first().click();
  cy.log('Go to classroom builder');
  cy.dataCy('classroom-builder-step-1').click();
};

const logout = () => {
  cy.log('Click on profile dropdown');
  cy.dataCy('dropdown-button').click();
  cy.log('Click on logout');
  cy.dataCy('logout-button').click();
};

describe('Classroom Manager', {defaultCommandTimeout: 20000}, () => {
  it('Student should be added to classroom', () => {
    loadClassroomPage();
    cy.log('Wait for page to load');
    cy.wait(3000);
    cy.log('Click on search student');
    cy.dataCy('edit-class-button').click();
    cy.log('Enter student name');
    cy.dataCy('edit-class-input').clear().type(studentName);
    cy.log('Select first student');
    cy.dataCy('edit-class-item-0').click();
    cy.log('Wait for page to load');
    cy.wait(1000);
    cy.log('Click on add student');
    cy.dataCy('edit-class-add-button').click();
    cy.log('Wait for page to load');
    cy.wait(1000);
    cy.log('Check if student is added');
    cy.get('p')
      .invoke('text')
      .then((text) => {
        expect(text).includes(sucessMessage);
      });
    cy.log('Check Student in the list');
    cy.get('div')
      .invoke('text')
      .then((text) => {
        expect(text).includes(studentName);
      });
    logout();
    cy.log('Login as student');
    cy.login(studentConfig.email, studentConfig.password);
    cy.log('Wait for page to load');
    cy.wait(10000);
    cy.log('Check if it is on the dashboard');
    cy.url().should('contain', urlConfig.dashboardURL);
    cy.log('Wait for page to load');
    cy.wait(5000);
    cy.log('Check if there is a emoji feedback');
    cy.get('body').then((body) => {
      if (body.find('[data-cy="emoji-feedback-card"]').length > 0) {
        cy.dataCy('emoji-feedback-card').first().click();
      }
    });
    cy.log('Click on the notebook link');
    cy.get(`button:contains(${notebookLink})`).click();
    cy.log('Wait for page to load');
    cy.wait(3000);
    cy.log('Check if course name is correct');
    cy.get('div')
      .invoke('text')
      .then((text) => {
        expect(text).includes(courseName);
      });
    logout();
    loadClassroomPage();
    cy.log('Wait for page to load');
    cy.wait(5000);
    // cy.dataCy('delete-user-7-button').click();
    // cy.dataCy('edit-class-delete-student-modal').click();
    // cy.get('p')
    //   .invoke('text')
    //   .then((text) => {
    //     expect(text).includes(sucessMessage);
    //   });
  });
});
