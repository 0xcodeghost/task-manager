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
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const taskCount = document.getElementById("task-count");

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

     tasks.unshift(newTask);

    renderTasks();

  // Clear the form for the next task
  taskForm.reset();
  taskInput.focus();
}

// =========================
// 4. Helpers
// =========================

function formatDate(dateString) {
    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}


// =========================
// 5. Render
// =========================

function createTaskElement(task) {

    const li = document.createElement("li");
    li.className = "task-item";
    li.dataset.id = task.id;

    if (task.completed) {
        li.classList.add("completed");
    }

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-check";
    checkbox.checked = task.completed;

    // Text + category + date
    const info = document.createElement("div");
    info.className = "task-info";

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const meta = document.createElement("div");
    meta.className = "task-meta";

    const badge = document.createElement("span");
    badge.className = "badge badge-" + task.category.toLowerCase();
    badge.textContent = task.category;
    meta.appendChild(badge);

    if (task.dueDate) {
        const date = document.createElement("span");
        date.className = "task-date";
        date.textContent = "📅 " + formatDate(task.dueDate);
        meta.appendChild(date);
    }

    info.appendChild(text);
    info.appendChild(meta);

    // Buttons
    const actions = document.createElement("div");
    actions.className = "task-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "icon-btn edit-btn";
    editBtn.textContent = "Edit";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "icon-btn delete-btn";
    deleteBtn.textContent = "Delete";

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    // Put everything together
    li.appendChild(checkbox);
    li.appendChild(info);
    li.appendChild(actions);

    return li;
}

function renderTasks() {

    // 1. Clear the list
    taskList.innerHTML = "";

    // 2. Draw every task
    tasks.forEach(function (task) {
        taskList.appendChild(createTaskElement(task));
    });

    // 3. Show the empty message only when there are no tasks
    emptyState.hidden = tasks.length > 0;

    // 4. Update the counter
    const activeCount = tasks.filter(function (task) {
        return !task.completed;
    }).length;

    taskCount.textContent = activeCount + (activeCount === 1 ? " task left" : " tasks left");
}

taskForm.addEventListener("submit", addTask);

renderTasks();