const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TodoList", function () {
  let Todo, todo, owner, firstWallet, secondWallet;
  beforeEach(async () => {
    Todo = await ethers.getContractFactory("TodoList");
    todo = await Todo.deploy("First Task", "Body Content", 1);
    [owner, firstWallet, secondWallet] = await ethers.getSigners();
  });

  describe("Deployment", () => {
    it("Should create the first todo", async () => {
      const task = await todo.tasks(owner.address, 0);
      expect(task.title).to.equal("First Task");
      expect(task.description).to.equal("Body Content");
      expect(task.priority).to.equal(1);
    });
    it("Should have one todo for the wallet", async () => {
      const taskCounter = await todo.walletTasksCounter(owner.address);
      expect(taskCounter).to.equal(1);
    });
  });

  describe("TodoList Creation", () => {
    it("Should create a todo for a connected wallet", async () => {
      await todo.connect(firstWallet).createTask("My Task", "Content", 10);
      const task = await todo.tasks(firstWallet.address, 0);

      expect(task.title).to.equal("My Task");
      expect(task.description).to.equal("Content");
      expect(task.priority).to.equal(10);
      expect(task.status).to.equal(false);
      expect(task.wallet).to.equal(firstWallet.address);
      expect(task.trashed).to.equal(false);
    });

    it("Should keep track of the amount of todos per wallet", async () => {
      await todo.connect(firstWallet).createTask("My Task", "Content", 8);
      await todo.connect(firstWallet).createTask("My Task", "Content", 9);

      await todo.connect(secondWallet).createTask("My Task", "Content", 5);

      expect(await todo.walletTasksCounter(firstWallet.address)).to.equal(2);
      expect(await todo.walletTasksCounter(secondWallet.address)).to.equal(1);
    });
  });

  describe("Toggle TODO", () => {
    it("Should set todo as complete", async () => {
      await todo.connect(firstWallet).createTask("My Task", "Content", 10);
      const task = await todo.tasks(firstWallet.address, 0);

      await todo.connect(firstWallet).toggleTask(task.id);

      const taskCompleted = await todo.tasks(firstWallet.address, task.id);
        
      expect(taskCompleted.status).to.equal(true);
    });

    it("Should set todo as not completed", async () => {
        await todo.connect(firstWallet).createTask("My Task", "Content", 10);
        const task = await todo.tasks(firstWallet.address, 0);
  
        await todo.connect(firstWallet).toggleTask(task.id);
        const taskCompleted = await todo.tasks(firstWallet.address, task.id);
        expect(taskCompleted.status).to.equal(true);

        await todo.connect(firstWallet).toggleTask(task.id);
        const taskNotCompleted = await todo.tasks(firstWallet.address, task.id);
        expect(taskNotCompleted.status).to.equal(false);
      });
  });
});
