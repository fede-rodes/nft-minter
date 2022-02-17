import { expect } from "chai";
import { Signer, Contract, ContractTransaction } from "ethers";
import { ethers, network } from "hardhat";

describe("Minter contract", () => {
  let owner: Signer;
  let alice: Signer;
  let bob: Signer;
  let aliceAddress: string;
  let bobAddress: string;
  let minter: Contract;
  let snapshotId: unknown;

  before(async () => {
    [owner, alice, bob] = await ethers.getSigners();

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

    const tx = (await minter
      .connect(alice)
      .mintNFT(aliceAddress, metadata)) as ContractTransaction;
    const txReceipt = await tx.wait();

    const event = txReceipt?.events ? txReceipt.events[0] : null;
    const value = event?.args ? event.args[2] : null;
    const tokenId = value.toNumber();

    const tokenURI = await minter.tokenURI(tokenId);

    expect(tokenId).to.be.equal(1);
    expect(tokenURI).to.be.equal(metadata);
  });

  it("should not be possible to mint the same NFT twice", async () => {
    const metadata = "https://game.example/item-id-8u5h2m.json";

    (await minter
      .connect(alice)
      .mintNFT(aliceAddress, metadata)) as ContractTransaction;

    await expect(
      minter.connect(bob).mintNFT(bobAddress, metadata)
    ).to.be.revertedWith("Minter: NFT already minted!");
  });
});
