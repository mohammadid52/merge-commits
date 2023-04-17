describe('Login', () => {
  it('Logs in successfully', () => {
    cy.visit('https://iconoclast.selready.com/login')

    cy.get('[name="email"]').type('michael.russell@zoiq.io')
    cy.get('[name="password"]').type('admin123')


    cy.get('.btn-primary').click()

    // Assert that we have been redirected to the dashboard
    cy.url().should('include', '/dashboard/manage-institutions/institution/6539589f-44d2-4749-b0ba-87086b7fe1d8/staff')
  })
})
