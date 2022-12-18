/// <reference types="cypress" />
import {urlConfig, loginConfig} from './config';

const logout = () => {
  cy.dataCy('dropdown-button').click();
  cy.dataCy('logout-button').click();
};

describe(
  'Well... Testing everything now as admin',
  {defaultCommandTimeout: 10000},
  () => {
    it('go to login page', () => {
      cy.login(loginConfig.admin.username, loginConfig.admin.password);
    });

    it("check out 'Institution Manager' pages", () => {
      cy.wait(5000);

      cy.hoverOnMenuItems('institution-manager', [
        'general-information-item',
        'staff-item',
        'user-registry-item',
        'register-new-user-item'
      ]);
    });

    it("check out 'Course Builder' pages", () => {
      cy.wait(5000);

      cy.hoverOnMenuItems('course-builder', [
        'course-manager-item',
        'unit-manager-item',
        'lesson-manager-item',
        'game-changers-item'
      ]);
    });
    it("check out 'Classroom Builder' pages", () => {
      cy.wait(5000);

      cy.hoverOnMenuItems('classroom-builder', ['classroom-manager-item']);
    });

    it("check out 'Community Manager' pages", () => {
      cy.wait(5000);

      cy.hoverOnMenuItems('community-manager', ['front-page-item']);
    });

    it("check out 'Analytics Manager' pages", () => {
      cy.wait(5000);

      cy.hoverOnMenuItems('analytics-manager', [
        'download-surveys-item',
        'upload-surveys-item'
      ]);
    });

    it('sign out as admin', logout);
  }
);

describe(
  'Well... Testing everything now as admin',
  {defaultCommandTimeout: 10000},
  () => {
    it('go to login page', () => {
      cy.login(loginConfig.teacher.username, loginConfig.teacher.password);
    });

    it("check out 'Institution Manager' pages", () => {
      cy.wait(5000);

      cy.hoverOnMenuItems('institution-manager', [
        'general-information-item',
        'staff-item',
        'user-registry-item'
      ]);
    });

    it("check out 'Course Builder' pages", () => {
      cy.wait(5000);

      cy.hoverOnMenuItems('course-builder', [
        'course-manager-item',
        'unit-manager-item',
        'lesson-manager-item',
        'game-changers-item'
      ]);
    });
    it("check out 'Classroom Builder' pages", () => {
      cy.wait(5000);

      cy.hoverOnMenuItems('classroom-builder', [
        'classroom-manager-item',
        'student-roster-item',
        'live-classroom-item'
      ]);
    });

    it("check out 'Community Manager' pages", () => {
      cy.wait(5000);

      cy.hoverOnMenuItems('community-manager', ['front-page-item']);
    });

    it("check out 'Analytics Manager' pages", () => {
      cy.wait(5000);

      cy.hoverOnMenuItems('analytics-manager', [
        'download-surveys-item',
        'upload-surveys-item'
      ]);
    });

    it('sign out as teacher', logout);
  }
);
