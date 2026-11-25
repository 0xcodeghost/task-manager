// =========================
// 1. State
// =========================

let tasks = [];

// =========================
// 2. DOM Elements
// =========================

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const categorySelect = document.getElementById("category-select");
const dueDateInput = document.getElementById("due-date");

// =========================
// 3. Add Task
// =========================

function addTask(event) {
  // Stop the form from reloading the page
  event.preventDefault();

  // Read the text and remove extra spaces
  const text = taskInput.value.trim();

  // Don't allow empty tasks
  if (text === "") {
    return;
  }

  // Create one task object
  const newTask = {
    id: Date.now(),
    text: text,
    category: categorySelect.value,
    dueDate: dueDateInput.value,
    completed: false,
  };

  // Add it to the state
  tasks.push(newTask);

  console.log(tasks);

  // Clear the form for the next task
  taskForm.reset();
  taskInput.focus();
}

taskForm.addEventListener("submit", addTask);
