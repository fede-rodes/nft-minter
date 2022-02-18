/// <reference types="cypress" />

describe('The NFTs API', () => {
  it('gets the right NFT shape', () => {
    cy.request('/api/nfts')
      .its('body')
      .then(({ nfts }) => {
        expect(nfts).to.have.length(4)
        expect(nfts[0]).to.have.property('tokenId').and.to.be.a('number')
        expect(nfts[0]).to.have.property('tokenURI').and.to.be.a('string')
        // Etc.
      })
  })
})
