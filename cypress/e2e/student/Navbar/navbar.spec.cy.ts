import {loginConfig, urlConfig} from '../../config';

const navbar_links = {
  dashboard: 'Dashboard',
  gameChangers: 'Game Changers',
  community: 'Community',
  notebook: 'Notebook'
};

describe('Navbar flow', () => {
  beforeEach(() => {
    cy.log('Login as admin');
    cy.login(loginConfig.student.username, loginConfig.student.password);
  });

  it('Use Navbar Links for Student', {defaultCommandTimeout: 20000}, function () {
    cy.log('Wait for page to load');
    cy.wait(10000); // wait for page to load
    cy.log('Check if it is on the dashboard');
    cy.url().should('contain', urlConfig.dashboardURL);
    cy.log('Wait for page to load');
    cy.wait(10000);

    cy.log('Go to Game Changers through navbar');
    cy.get(`button:contains(${navbar_links.gameChangers})`).click();
    cy.log('Check if it is on the expected page');
    cy.url().should('contain', 'game-changers');

    cy.log('Go to Community through navbar');
    cy.get(`button:contains(${navbar_links.community})`).click();
    cy.log('Check if it is on the expected page');
    cy.url().should('contain', 'community');

    cy.log('Go to Notebook through navbar');
    cy.get(`button:contains(${navbar_links.notebook})`).click();
    cy.log('Check if it is on the expected page');
    cy.url().should('contain', 'anthology');

    cy.log('Go to Dashboard through navbar');
    cy.get(`button:contains(${navbar_links.dashboard})`).click();
    cy.log('Check if it is on the expected page');
    cy.url().should('contain', 'home');

    cy.log('Logout through Navbar');
    cy.dataCy('dropdown-button').click();
    cy.dataCy('logout-button').click();
  });
});
