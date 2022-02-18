import { expect } from "chai";
import { Signer, Contract, ContractTransaction } from "ethers";
import { ethers, network } from "hardhat";

describe("Minter contract", () => {
  let owner: Signer;
  let alice: Signer;
  let bob: Signer;
  let ownerAddress: string;
  let aliceAddress: string;
  let bobAddress: string;
  let minter: Contract;
  let snapshotId: unknown;

  before(async () => {
    [owner, alice, bob] = await ethers.getSigners();

    ownerAddress = await owner.getAddress();
    aliceAddress = await alice.getAddress();
    bobAddress = await bob.getAddress();

    const Minter = await ethers.getContractFactory("Minter", owner);
    minter = await Minter.deploy();

    snapshotId = await network.provider.request({
      method: "evm_snapshot",
      params: [],
    });
  });

  afterEach(async () => {
    await network.provider.request({
      method: "evm_revert",
      params: [snapshotId],
    });
    snapshotId = await network.provider.request({
      method: "evm_snapshot",
      params: [],
    });
  });

  it("should be possible for anybody to mint an NFT and return it", async () => {
    const metadata = "https://game.example/item-id-8u5h2m.json";
    // ^ This tokenURI should resolve to a JSON document that might look something like:
    // {
    //   "name": "Thor's hammer",
    //   "description": "Mjölnir, the legendary hammer of the Norse god of thunder.",
    //   "image": "https://game.example/item-id-8u5h2m.png",
    //   "strength": 20
    // }

    expect(await minter.balanceOf(aliceAddress)).to.be.equal(0);
    expect(await minter.mintedURIs(metadata)).to.be.false;
    expect(await minter.minterAddresses(aliceAddress)).to.be.false;

    const tx = (await minter
      .connect(alice)
      .mintNFT(metadata)) as ContractTransaction;
    const txReceipt = await tx.wait();

    const event = txReceipt?.events ? txReceipt.events[0] : null;
    const value = event?.args ? event.args[2] : null;
    const tokenId = value.toNumber();

    const tokenURI = await minter.tokenURI(tokenId);

    expect(tokenId).to.be.equal(1);
    expect(tokenURI).to.be.equal(metadata);
    expect(await minter.balanceOf(aliceAddress)).to.be.equal(1);
    expect(await minter.mintedURIs(metadata)).to.be.true;
    expect(await minter.minterAddresses(aliceAddress)).to.be.true;
  });

  it("should not be possible to mint the same NFT twice", async () => {
    const metadata = "https://game.example/item-id-8u5h2m.json";

    await minter.connect(alice).mintNFT(metadata);

    await expect(minter.connect(bob).mintNFT(metadata)).to.be.revertedWith(
      "Minter: NFT already minted!"
    );
  });

  it("should not be possible to mint two NFTs using the same account", async () => {
    const metadata1 = "https://game.example/item-id-8u5h2m.json";
    const metadata2 = "https://game.example/item-id-3x9jsh.json";

    await minter.connect(alice).mintNFT(metadata1);

    await expect(minter.connect(alice).mintNFT(metadata2)).to.be.revertedWith(
      "Minter: address already used!"
    );
  });

  it("should be possible to mint two NFTs using two different accounts", async () => {
    const metadata1 = "https://game.example/item-id-8u5h2m.json";
    const metadata2 = "https://game.example/item-id-3x9jsh.json";

    expect(await minter.balanceOf(aliceAddress)).to.be.equal(0);
    expect(await minter.balanceOf(bobAddress)).to.be.equal(0);

    await minter.connect(alice).mintNFT(metadata1);
    await minter.connect(bob).mintNFT(metadata2);

    expect(await minter.balanceOf(aliceAddress)).to.be.equal(1);
    expect(await minter.balanceOf(bobAddress)).to.be.equal(1);
  });

  it("should be possible for the owner to mint several NFTs", async () => {
    const metadata1 = "https://game.example/item-id-8u5h2m.json";
    const metadata2 = "https://game.example/item-id-3x9jsh.json";

    expect(await minter.balanceOf(ownerAddress)).to.be.equal(0);

    await minter.connect(owner).mintNFT(metadata1);
    await minter.connect(owner).mintNFT(metadata2);

    expect(await minter.balanceOf(ownerAddress)).to.be.equal(2);
  });

  // TODO: see how pinata works and if we can set a baseURI and avoid
  // passing uri param on mintNFT call

  // TODO test MAX_SUPPLY and in case of revert that mintedURIs and minterAddresses
  // is set back to false
});
