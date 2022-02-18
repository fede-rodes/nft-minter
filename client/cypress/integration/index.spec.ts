/// <reference types="cypress" />

describe('Index page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('shows page content', () => {
    cy.title().should('eq', 'Home')
    cy.contains('button', 'Connect with Metamask').should('be.enabled')
    cy.contains('h1', 'NFTs collection').should('exist')
    cy.request('/api/nfts')
      .its('body')
      .then(({ nfts }) => {
        cy.contains('p', `Count: ${nfts.length}`).should('exist')
      })
  })

  it('shows minted NFTs from fixtures', () => {
    cy.intercept('/api/nfts', {
      body: {
        "nfts": [
          {
            "tokenId": 1,
            "tokenURI": "ipfs://QmXhfZ3BcBdfwT7tPxxHScYG5ZzDbq36NUdjKFYm6wTEZJ/1.png"
          },
          {
            "tokenId": 2,
            "tokenURI": "ipfs://QmXhfZ3BcBdfwT7tPxxHScYG5ZzDbq36NUdjKFYm6wTEZJ/2.png"
          },
          {
            "tokenId": 3,
            "tokenURI": "ipfs://QmXhfZ3BcBdfwT7tPxxHScYG5ZzDbq36NUdjKFYm6wTEZJ/3.png"
          },
          {
            "tokenId": 4,
            "tokenURI": "ipfs://QmXhfZ3BcBdfwT7tPxxHScYG5ZzDbq36NUdjKFYm6wTEZJ/4.png"
          }
        ]
      },
    }).as('getNFTs')

    cy.wait('@getNFTs').then(({ response }) => {
      const { nfts } = response.body

      nfts.forEach((nft) => {
        cy.log(nft)
      })
    })
  })
})
