<template>
  <div id="app" class="container">
    <button type="button" class="btn btn-primary" @click="connectToWallet">
      Connect Account
    </button>
    <section class="container">
      <h3>wallet: {{ wallet }}</h3>
      <h3>{{ errorMessage }}</h3>
    </section>
    <section v-if="wallet">
      <form action="POST">
        <div class="mb-3">
          <label for="" class="form-label">Title</label>
          <input v-model="todo.title" type="text" class="form-control" placeholder="" />
        </div>
        <div class="mb-3">
          <label for="" class="form-label">Content</label>
          <input v-model="todo.content" type="text" class="form-control" placeholder="" />
        </div>
        <button type="button" class="btn btn-secondary" @click="createTodo">
          Create todo
        </button>
      </form>

      <section>
        <h1>Todo List:</h1>
        <ul>
          <li></li>
        </ul>
      </section>
    </section>
  </div>
</template>

<script>
import { ethers } from "ethers";
import TodoList from "../artifacts/contracts/TodoList.sol/TodoList.json";

export default {
  name: "App",
  data() {
    return {
      todo: {
        title: "",
        content: "",
        priority: 0,
      },
      wallet: "",
      errorMessage: "",
      contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      provider: null,
      signer: null,
      contract: null,
      todos: [],
    };
  },
  methods: {
    connectToWallet() {
      const { ethereum } = window;
      if (ethereum) {
        window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then((result) => {
              console.log(result);
            this.handleConnectedAccount(result[0], ethereum);
          });
        return;
      }
      this.errorMessage = "Need to install metamask";
    },

    handleConnectedAccount(wallet, ethereum) {
      this.wallet = wallet;
      this.provider = new ethers.providers.Web3Provider(ethereum);
      this.signer = this.provider.getSigner();
      this.contract = new ethers.Contract(
        this.contractAddress,
        TodoList.abi,
        this.signer
      );
      this.fetchTodos();
    },
    
    async createTodo(e) {
      e.preventDefault;
      await this.contract.createTask(
        this.todo.title,
        this.todo.content,
        this.todo.priority
      );
    },
    async fetchTodos() {
      const amountOfTodos = await this.contract.walletTasksCounter(this.wallet);
      console.log(amountOfTodos);
    },
  },
};
</script>

<style></style>
