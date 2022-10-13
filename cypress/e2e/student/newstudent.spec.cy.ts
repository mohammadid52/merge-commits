/// <reference types="cypress" />

import {loginConfig, urlConfig} from '../config';

const userName = 'cypressselfpaced';
const userId = 'fe25529f-9ad7-4371-b43e-8cc1bb4c39bf';
const baseUrl = 'http://localhost:8085/dashboard/manage-institutions/institution';
const adminId = 'f3aef681-6fff-4795-8fde-67cb159bd275';
const registryUrl = `${baseUrl}/${adminId}/manage-users`;
const userUrl = `${baseUrl}/${adminId}/manage-users/${userId}`;

const userLookup = (ondemand: string) => {
  cy.dataCy('user-loookup-search').clear().type(`${userName}{enter}`); // search for user
  cy.wait(3000); // wait for page to load
  cy.visit(userUrl); // go to user page
  cy.wait(10000); // Wait
  cy.dataCy('self-paced-text')
    .invoke('text')
    .then((text) => {
      expect(text).equal(ondemand);
    });
};

const checkForStudent = (ondemand: string) => {
  cy.login(loginConfig.selfPacedStudent.username, loginConfig.selfPacedStudent.password);
  cy.wait(10000); // wait for it to login
  cy.url().should('contain', urlConfig.dashboardURL); // Check if it is on dashboard page
  cy.get('body').then((body) => {
    if (body.find('[data-cy="emoji-feedback-button"]').length > 0) {
      cy.dataCy('emoji-feedback-button').click(); // if emoji feedback popup is open click on save button
    }
  });
  if (ondemand === 'YES') {
    cy.get('h3')
      .invoke('text')
      .then((text) => {
        expect(text).equal('Self-Paced');
      });
  } else {
    cy.get('h3')
      .invoke('text')
      .then((text) => {
        expect(text).not.eq('Self-Paced');
      }); // check if self paced is visible
  }
};

// describe('Student flow', () => {
//   beforeEach(() => {
//     cy.login(loginConfig.student.username, loginConfig.student.password);
//   });

//   it('should go to profile', {defaultCommandTimeout: 20000}, function () {
//     cy.url().should('contain', urlConfig.dashboardURL); // Check if it is on dashboard page
//     cy.dataCy('dropdown-button').click(); // Click on profile dropdown
//     cy.dataCy('dropdown-item-profile').click(); // Click on edit profile dropdown button
//   });
// });

describe('Check Student Ondemand', () => {
  it('Should be Classroom ', {defaultCommandTimeout: 20000}, function () {
    cy.login(loginConfig.admin.username, loginConfig.admin.password);
    cy.url().should('contain', urlConfig.dashboardURL); // Check if it is on dashboard page
    cy.visit(registryUrl); // go to user registry page
    cy.wait(10000); // Wait
    cy.dataCy('user-loookup-search').clear().type(`${userName}{enter}`); // search for user
    cy.wait(3000); // wait for page to load
    cy.visit(userUrl); // go to user page
    cy.wait(10000); // Wait
    // userLookup('YES');
    cy.dataCy('edit-user-button').click(); // Click on edit user button
    cy.dataCy('dropdown-ondemand').click(); // Click on ondemand dropdown
    cy.dataCy('dropdown-item-ondemand-0').click(); // Click on yes dropdown item
    cy.dataCy('edit-user-save-button').click(); // Click on save

    userLookup('NO');
    cy.dataCy('dropdown-button').click(); // Click on profile dropdown
    cy.dataCy('logout-button').click(); // Logout

    checkForStudent('NO');
  });

  it('Should be Self Paced ', {defaultCommandTimeout: 20000}, function () {
    cy.login(loginConfig.admin.username, loginConfig.admin.password);
    cy.url().should('contain', urlConfig.dashboardURL); // Check if it is on dashboard page
    cy.visit(registryUrl); // go to user registry page
    cy.wait(10000); // Wait
    cy.dataCy('user-loookup-search').clear().type(`${userName}{enter}`); // search for user
    cy.wait(3000); // wait for page to load
    cy.visit(userUrl); // go to user page
    cy.wait(10000); // Wait
    // userLookup('NO');
    cy.dataCy('edit-user-button').click(); // Click on edit user button
    cy.dataCy('dropdown-ondemand').click(); // Click on ondemand dropdown
    cy.dataCy('dropdown-item-ondemand-1').click(); // Click on yes dropdown item
    cy.dataCy('edit-user-save-button').click(); // Click on save

    userLookup('YES');
    cy.dataCy('dropdown-button').click(); // Click on profile dropdown
    cy.dataCy('logout-button').click(); // Logout

    checkForStudent('YES');
  });
});
