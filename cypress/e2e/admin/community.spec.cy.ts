/// <reference types="cypress" />

import {loginConfig, urlConfig} from '../config';
import {communityTypes} from '../../../src/components/Community/constants.community';

const communityUrl = 'http://localhost:8085/dashboard/community/front';
const demoYoutubeLink = 'https://www.youtube.com/watch?v=MiebCHmiszs';
const descriptionText = 'Cypress Test Spotlight';
const adminCommentText = 'Cypress Test Admin Comment';
const studentCommentText = 'Cypress Test Student Comment';
// Announcement
const announcementOverlayText = 'Cypress Test Announcement Overlay';
const descriptionAnnouncementText = 'Cypress Test Announcement';
const filePath = 'cypress/fixtures/images/announcement.png';
// Event
const eventOverlayText = 'Cypress Test Event Overlay';
const descriptionEventText = 'Cypress Test Event';
const eventFilePath = 'cypress/fixtures/images/event.jpg';
const eventStartTime = '6:30 PM';
const eventEndTime = '7:00 PM';
const eventDate = '30/03/2023';

describe('Community Should Work', () => {
  it('Spotlight test', {defaultCommandTimeout: 20000}, function () {
    cy.login(loginConfig.admin.username, loginConfig.admin.password);
    cy.wait(10000);
    cy.url().should('contain', urlConfig.dashboardURL);
    cy.visit(communityUrl);
    cy.wait(10000);
    cy.dataCy('open-builder-button').click({force: true});
    cy.dataCy(communityTypes.SPOTLIGHT).click({force: true});
    cy.get('h3:contains("Spotlight Card")').should('exist');
    cy.dataCy('selector-spotlight-button').click();
    cy.dataCy('selector-item-spotlight-0').click();
    cy.dataCy('spotlight-link-input').clear().type(demoYoutubeLink);
    cy.get('.DraftEditor-root').clear().type(descriptionText);
    cy.dataCy('save-spotlight-button').click();

    cy.wait(10000);
    cy.get('p')
      .invoke('text')
      .then((text) => {
        expect(text).includes(descriptionText);
      });
    cy.dataCy('comment-input').first().clear().type(`${adminCommentText}{enter}`);
    cy.dataCy('like-button').first().click();
    cy.dataCy('likes-count')
      .first()
      .invoke('text')
      .then((text) => {
        expect(text).equals(' 1');
      });
    cy.dataCy('dropdown-button').click(); // Click on profile dropdown
    cy.dataCy('logout-button').click(); // Logout

    // Student Check
    cy.login(loginConfig.student.username, loginConfig.student.password);
    cy.wait(10000);
    cy.url().should('contain', urlConfig.dashboardURL);
    cy.visit(communityUrl);

    cy.wait(10000);
    cy.get('p')
      .invoke('text')
      .then((text) => {
        expect(text).includes(descriptionText);
      });
    cy.wait(10000);
    cy.dataCy('show-comments-button').first().scrollIntoView();
    cy.dataCy('show-comments-button').first().click({force: true});
    cy.wait(10000);
    cy.dataCy('comment-text')
      .first()
      .invoke('text')
      .then((text) => {
        expect(text).includes(adminCommentText);
      });
    cy.dataCy('comment-input').first().clear().type(`${studentCommentText}{enter}`);
    cy.dataCy('like-button').first().click();
    cy.dataCy('likes-count')
      .first()
      .invoke('text')
      .then((text) => {
        expect(text).equals(' 2');
      });

    cy.dataCy('dropdown-button').click(); // Click on profile dropdown
    cy.dataCy('logout-button').click(); // Logout

    cy.login(loginConfig.admin.username, loginConfig.admin.password);
    cy.wait(10000);
    cy.url().should('contain', urlConfig.dashboardURL);
    cy.visit(communityUrl);
    cy.wait(10000);

    cy.dataCy('show-comments-button').first().scrollIntoView(); // Scroll the window 500px down
    cy.dataCy('show-comments-button').first().click({force: true});
    cy.wait(10000);
    cy.dataCy('comment-text')
      .eq(0)
      .invoke('text')
      .then((text) => {
        expect(text).includes(studentCommentText);
      });
    cy.dataCy('likes-count')
      .first()
      .invoke('text')
      .then((text) => {
        expect(text).equals(' 2');
      });

    cy.dataCy('popover-button').first().click();
    cy.dataCy('card-delete-button').first().click();
    cy.get('p')
      .invoke('text')
      .then((text) => {
        expect(text).not.includes(descriptionText);
      });
  });

  it('Announcement test', {defaultCommandTimeout: 20000}, function () {
    cy.login(loginConfig.admin.username, loginConfig.admin.password);
    cy.wait(10000);
    cy.url().should('contain', urlConfig.dashboardURL);
    cy.visit(communityUrl);
    cy.wait(10000);
    cy.dataCy('open-builder-button').click({force: true});
    cy.dataCy(communityTypes.ANNOUNCEMENTS).click({force: true});
    cy.get('h3:contains("Announcement Card")').should('exist');
    cy.get('input[type=file]').selectFile(filePath, {force: true});
    cy.dataCy('announcement-overlay-input').clear().type(announcementOverlayText);
    cy.get('.DraftEditor-root').clear().type(descriptionAnnouncementText);
    cy.dataCy('save-announcement-button').click();

    cy.wait(10000);
    cy.get('h1')
      .invoke('text')
      .then((text) => {
        expect(text).includes(announcementOverlayText);
      });
    cy.get('p')
      .invoke('text')
      .then((text) => {
        expect(text).includes(descriptionAnnouncementText);
      });
    cy.dataCy('comment-input').first().clear().type(`${adminCommentText}{enter}`);
    cy.dataCy('like-button').first().click();
    cy.dataCy('likes-count')
      .first()
      .invoke('text')
      .then((text) => {
        expect(text).equals(' 1');
      });
    cy.dataCy('dropdown-button').click(); // Click on profile dropdown
    cy.dataCy('logout-button').click(); // Logout

    // Student Check
    cy.login(loginConfig.student.username, loginConfig.student.password);
    cy.wait(10000);
    cy.url().should('contain', urlConfig.dashboardURL);
    cy.visit(communityUrl);

    cy.wait(20000);
    cy.get('h1')
      .invoke('text')
      .then((text) => {
        expect(text).includes(announcementOverlayText);
      });
    cy.get('p')
      .invoke('text')
      .then((text) => {
        expect(text).includes(descriptionAnnouncementText);
      });
    cy.wait(10000);
    cy.dataCy('show-comments-button').first().scrollIntoView();
    cy.dataCy('show-comments-button').first().click({force: true});
    cy.wait(10000);
    cy.dataCy('comment-text')
      .first()
      .invoke('text')
      .then((text) => {
        expect(text).includes(adminCommentText);
      });
    cy.dataCy('comment-input')
      .first()
      .clear()
      .type(`${studentCommentText}{enter}`, {force: true});
    cy.dataCy('like-button').first().click();
    cy.dataCy('likes-count')
      .first()
      .invoke('text')
      .then((text) => {
        expect(text).equals(' 2');
      });

    cy.dataCy('dropdown-button').click(); // Click on profile dropdown
    cy.dataCy('logout-button').click(); // Logout

    cy.login(loginConfig.admin.username, loginConfig.admin.password);
    cy.wait(10000);
    cy.url().should('contain', urlConfig.dashboardURL);
    cy.visit(communityUrl);
    cy.wait(10000);

    cy.dataCy('show-comments-button').first().scrollIntoView(); // Scroll the window 500px down
    cy.dataCy('show-comments-button').first().click({force: true});
    cy.wait(10000);
    cy.dataCy('comment-text')
      .eq(0)
      .invoke('text')
      .then((text) => {
        expect(text).includes(studentCommentText);
      });
    cy.dataCy('likes-count')
      .first()
      .invoke('text')
      .then((text) => {
        expect(text).equals(' 2');
      });

    cy.dataCy('popover-button').first().click();
    cy.dataCy('card-delete-button').first().click();
    cy.get('p')
      .invoke('text')
      .then((text) => {
        expect(text).not.includes(descriptionAnnouncementText);
      });
  });

  it('Event test', {defaultCommandTimeout: 20000}, function () {
    cy.login(loginConfig.admin.username, loginConfig.admin.password);
    cy.wait(10000);
    cy.url().should('contain', urlConfig.dashboardURL);
    cy.visit(communityUrl);
    cy.wait(10000);
    cy.dataCy('open-builder-button').click({force: true});
    cy.dataCy(communityTypes.EVENT).click({force: true});
    cy.get('h3:contains("Event Card")').should('exist');
    cy.get('input[type=file]').selectFile(eventFilePath, {force: true});
    cy.dataCy('event-overlay-input').clear().type(eventOverlayText);
    cy.get('.DraftEditor-root').clear().type(descriptionEventText);
    cy.get('input[placeholder="Start Time"]').clear().type(eventStartTime);
    cy.get('input[placeholder="End Time"]').clear().type(eventEndTime);
    cy.get('input[placeholder="Date"]').clear().type(eventDate);
    cy.dataCy('save-event-button').click();

    cy.wait(10000);
    cy.get('h1')
      .invoke('text')
      .then((text) => {
        expect(text).includes(eventOverlayText);
      });
    cy.get('p')
      .invoke('text')
      .then((text) => {
        expect(text).includes(descriptionEventText);
      });
    cy.dataCy('comment-input').first().clear().type(`${adminCommentText}{enter}`);
    cy.dataCy('like-button').first().click();
    cy.dataCy('likes-count')
      .first()
      .invoke('text')
      .then((text) => {
        expect(text).equals(' 1');
      });
    cy.dataCy('dropdown-button').click(); // Click on profile dropdown
    cy.dataCy('logout-button').click(); // Logout

    // Student Check
    cy.login(loginConfig.student.username, loginConfig.student.password);
    cy.wait(10000);
    cy.url().should('contain', urlConfig.dashboardURL);
    cy.visit(communityUrl);
    cy.wait(20000);

    cy.get('body').then((body) => {
      if (body.find('[data-cy="emoji-feedback-button"]').length > 0) {
        cy.dataCy('emoji-feedback-button').click(); // If emoji feedback popup is open click on save button
      }
    });
    cy.get('h1')
      .invoke('text')
      .then((text) => {
        expect(text).includes(eventOverlayText);
      });
    cy.get('p')
      .invoke('text')
      .then((text) => {
        expect(text).includes(descriptionEventText);
      });
    cy.wait(10000);
    cy.dataCy('show-comments-button').first().scrollIntoView();
    cy.dataCy('show-comments-button').first().click({force: true});
    cy.wait(10000);
    cy.dataCy('comment-text')
      .first()
      .invoke('text')
      .then((text) => {
        expect(text).includes(adminCommentText);
      });
    cy.dataCy('comment-input')
      .first()
      .clear()
      .type(`${studentCommentText}{enter}`, {force: true});
    cy.dataCy('like-button').first().click();
    cy.dataCy('likes-count')
      .first()
      .invoke('text')
      .then((text) => {
        expect(text).equals(' 2');
      });

    cy.dataCy('dropdown-button').click(); // Click on profile dropdown
    cy.dataCy('logout-button').click(); // Logout

    cy.login(loginConfig.admin.username, loginConfig.admin.password);
    cy.wait(10000);
    cy.url().should('contain', urlConfig.dashboardURL);
    cy.visit(communityUrl);
    cy.wait(10000);

    cy.dataCy('show-comments-button').first().scrollIntoView(); // Scroll the window 500px down
    cy.dataCy('show-comments-button').first().click({force: true});
    cy.wait(10000);
    cy.dataCy('comment-text')
      .eq(0)
      .invoke('text')
      .then((text) => {
        expect(text).includes(studentCommentText);
      });
    cy.dataCy('likes-count')
      .first()
      .invoke('text')
      .then((text) => {
        expect(text).equals(' 2');
      });

    cy.dataCy('popover-button').first().click();
    cy.dataCy('card-delete-button').first().click();
    cy.get('p')
      .invoke('text')
      .then((text) => {
        expect(text).not.includes(descriptionEventText);
      });
  });
});
