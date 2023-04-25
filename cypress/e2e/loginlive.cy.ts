describe('Login', () => {
  it('Logs in successfully', () => {
    cy.visit('http://localhost:8085/login')

    cy.get('[name="email"]').type('michael.russell@zoiq.io')
    cy.get('[name="password"]').type('admin123')

    cy.get('form').submit()

    // Assert that we have been redirected to the dashboard
    cy.url().should('include', '/dashboard/manage-institutions/institution/7374b3a9-1849-4033-b298-caed19e448a0/staff')
  })
})
