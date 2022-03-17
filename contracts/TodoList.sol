// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract TodoList {
    mapping(address => uint256) public walletTasksCounter;
    mapping(address => mapping(uint256 => Task)) public tasks;

    struct Task {
        uint256 id;
        string title;
        string description;
        address wallet;
        bool status;
        uint256 priority;
        bool trashed;
    }

    event TaskCreated(
        uint256 id,
        string title,
        string description,
        bool status
    );

    event TaskToggled(uint256 id, bool status);

    constructor() {}

    function createTask(
        string memory title,
        string memory description,
        uint256 priority
    ) public {
        uint256 tasksInWallet = walletTasksCounter[msg.sender]++;
        tasks[msg.sender][tasksInWallet] = Task(
            tasksInWallet,
            title,
            description,
            msg.sender,
            false,
            priority,
            false
        );
        emit TaskCreated(tasksInWallet, title, description, false);
    }

    function toggleTask(uint256 id) public {
        Task memory task = tasks[msg.sender][id];
        task.status = !task.status;
        tasks[msg.sender][id] = task;
        emit TaskToggled(id, task.status);
    }

    function deleteTask(uint256 id) public {
        require(tasks[msg.sender][id].id == id);
        Task memory task = tasks[msg.sender][id];
        task.trashed = true;
        tasks[msg.sender][id] = task;
    }
}
