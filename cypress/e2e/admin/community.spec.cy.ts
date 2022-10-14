/// <reference types="cypress" />

import {loginConfig, urlConfig} from '../config';
import {communityTypes} from '../../../src/components/Community/constants.community';

const communityUrl = 'http://localhost:8085/dashboard/community/front';
const demoYoutubeLink = 'https://www.youtube.com/watch?v=MiebCHmiszs';

describe('Spotlight Should Work', () => {
  it('Admin creates spotlight', {defaultCommandTimeout: 20000}, function () {
    cy.login(loginConfig.admin.username, loginConfig.admin.password);
    cy.wait(10000);
    cy.url().should('contain', urlConfig.dashboardURL);
    cy.visit(communityUrl);
    cy.wait(10000);
    cy.dataCy('open-builder-button').click();
    cy.dataCy(communityTypes.SPOTLIGHT).click({force: true});
    cy.get('h3:contains("Spotlight Card")').should('exist');
    cy.dataCy('selector-spotlight-button').click();
    cy.dataCy('selector-item-spotlight-0').click();
    cy.dataCy('spotlight-link-input').clear().type(demoYoutubeLink);
    cy.dataCy('spotlight-link-input').click();
  });
});
