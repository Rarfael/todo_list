const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TodoList", function () {
  let Todo, todo, wallet;
  beforeEach(async () => {
    Todo = await ethers.getContractFactory("TodoList");
    todo = await Todo.deploy("First Task", "Body Content", 1);
    [wallet] = await ethers.getSigners();
  });

  describe("Deployment", () => {
    it("Should create the first todo", async () => {
      const task = await todo.tasks(wallet.address, 0);
      expect(task.title).to.equal("First Task");
      expect(task.description).to.equal("Body Content");
      expect(task.priority).to.equal(1);
    });
    it("Should have one todo for the wallet", async () => {
        const taskCounter = await todo.walletTasksCounter(wallet.address);
        expect(taskCounter).to.equal(1);
      });
  });
});
