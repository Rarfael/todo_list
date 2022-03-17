const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const TodoList = await hre.ethers.getContractFactory("TodoList");
  const todo = await TodoList.deploy(
    "First Task",
    "Content of the first task",
    10
  );

  await todo.deployed();

  console.log("TodoList deployed to:", todo.address);

  const data = {
    address: todo.address,
    abi: JSON.parse(todo.interface.format('json')),
  };

  fs.writeFileSync('src/smart_contract/TodoList.json', JSON.stringify(data));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
