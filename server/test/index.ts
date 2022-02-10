import { expect } from "chai";
import { ethers } from "hardhat";

describe("Minter", () => {
  it("Should return the new greeting once it's changed", async () => {
    const Minter = await ethers.getContractFactory("Minter");
    const greeter = await Minter.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
