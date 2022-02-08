/// <reference types="cypress" />

describe('Index', function () {
  this.beforeEach(function () {
    cy.visit('/')
  })

  it('displays the page title', function () {
    cy.title().should('eq', 'Home')
  })

  it('contains a button to connect to the injected provider', function () {
    cy.contains('button', 'Connect with Metamask').should('be.enabled')
  })
})
