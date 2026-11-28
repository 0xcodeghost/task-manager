// =========================
// 1. State
// =========================

let tasks = [];
let editingId = null;
let currentFilter = "all";
let searchQuery = "";

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
const searchInput = document.getElementById("search-input");
const filterButtons = document.querySelectorAll(".filter-btn");

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
function getToday() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return year + "-" + month + "-" + day;
}


// =========================
// 5. Render
// =========================

function createTaskElement(task) {

    // If this task is being edited, show the edit form instead
    if (task.id === editingId) {
        return createEditElement(task);
    }

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

        // Overdue = due date is before today AND task is not completed
        if (task.dueDate < getToday() && !task.completed) {
            date.classList.add("overdue");
            date.textContent = "⚠️ Overdue · " + formatDate(task.dueDate);
        } else {
            date.textContent = "📅 " + formatDate(task.dueDate);
        }

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

function createEditElement(task) {

    const li = document.createElement("li");
    li.className = "task-item editing";
    li.dataset.id = task.id;

    // Text input
    const textInput = document.createElement("input");
    textInput.type = "text";
    textInput.className = "edit-input";
    textInput.value = task.text;
    textInput.maxLength = 100;

    // Category dropdown (copies the options from the Add form)
    const categoryEdit = document.createElement("select");
    categoryEdit.className = "edit-category";

    Array.from(categorySelect.options).forEach(function (option) {
        const newOption = document.createElement("option");
        newOption.value = option.value;
        newOption.textContent = option.textContent;
        newOption.selected = option.value === task.category;
        categoryEdit.appendChild(newOption);
    });

    // Date input
    const dateEdit = document.createElement("input");
    dateEdit.type = "date";
    dateEdit.className = "edit-date";
    dateEdit.value = task.dueDate;

    // Buttons
    const actions = document.createElement("div");
    actions.className = "task-actions";

    const saveBtn = document.createElement("button");
    saveBtn.className = "icon-btn save-btn";
    saveBtn.textContent = "Save";

    const cancelBtn = document.createElement("button");
    cancelBtn.className = "icon-btn cancel-btn";
    cancelBtn.textContent = "Cancel";

    actions.appendChild(saveBtn);
    actions.appendChild(cancelBtn);

    // Put everything together
    li.appendChild(textInput);
    li.appendChild(categoryEdit);
    li.appendChild(dateEdit);
    li.appendChild(actions);

    return li;
}

function getVisibleTasks() {
    return tasks.filter(function (task) {

        // 1. Filter by status
        if (currentFilter === "active" && task.completed) {
            return false;
        }

        if (currentFilter === "completed" && !task.completed) {
            return false;
        }

        // 2. Filter by search text
        return task.text.toLowerCase().includes(searchQuery.toLowerCase());
    });
}

function renderTasks() {

    const visibleTasks = getVisibleTasks();

    // 1. Clear the list
    taskList.innerHTML = "";

    // 2. Draw only the visible tasks
    visibleTasks.forEach(function (task) {
        taskList.appendChild(createTaskElement(task));
    });

    // 3. Empty message (different text for different situations)
    if (tasks.length === 0) {
        emptyState.textContent = "No tasks yet. Add your first task above.";
    } else {
        emptyState.textContent = "No tasks match your search or filter.";
    }

    emptyState.hidden = visibleTasks.length > 0;

    // 4. Counter (counts ALL active tasks, not only visible ones)
    const activeCount = tasks.filter(function (task) {
        return !task.completed;
    }).length;

    taskCount.textContent = activeCount + (activeCount === 1 ? " task left" : " tasks left");
}

taskForm.addEventListener("submit", addTask);

// =========================
// 6. Complete, Delete & Edit
// =========================

function toggleTask(id) {
    const task = tasks.find(function (item) {
        return item.id === id;
    });

    task.completed = !task.completed;

    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(function (item) {
        return item.id !== id;
    });

    renderTasks();
}

function startEdit(id) {
    editingId = id;
    renderTasks();

    // Put the cursor in the text box
    const input = taskList.querySelector(".edit-input");

    if (input) {
        input.focus();
    }
}

function cancelEdit() {
    editingId = null;
    renderTasks();
}

function saveEdit(id, taskItem) {
    const textInput = taskItem.querySelector(".edit-input");
    const newText = textInput.value.trim();

    // Don't allow an empty task
    if (newText === "") {
        textInput.focus();
        return;
    }

    const task = tasks.find(function (item) {
        return item.id === id;
    });

    task.text = newText;
    task.category = taskItem.querySelector(".edit-category").value;
    task.dueDate = taskItem.querySelector(".edit-date").value;

    editingId = null;
    renderTasks();
}

// One listener for all clicks inside the list (event delegation)
taskList.addEventListener("click", function (event) {

    const taskItem = event.target.closest(".task-item");

    if (!taskItem) {
        return;
    }

    const id = Number(taskItem.dataset.id);
    const target = event.target;

    if (target.classList.contains("task-check")) {
        toggleTask(id);
    }

    if (target.classList.contains("delete-btn")) {
        if (confirm("Delete this task?")) {
            deleteTask(id);
        }
    }

    if (target.classList.contains("edit-btn")) {
        startEdit(id);
    }

    if (target.classList.contains("save-btn")) {
        saveEdit(id, taskItem);
    }

    if (target.classList.contains("cancel-btn")) {
        cancelEdit();
    }
});

// Keyboard shortcuts while editing: Enter = save, Escape = cancel
taskList.addEventListener("keydown", function (event) {

    const taskItem = event.target.closest(".task-item");

    if (!taskItem || !taskItem.classList.contains("editing")) {
        return;
    }

    const id = Number(taskItem.dataset.id);

    if (event.key === "Enter") {
        saveEdit(id, taskItem);
    }

    if (event.key === "Escape") {
        cancelEdit();
    }
});

// =========================
// 7. Filters & Search
// =========================

filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {

        currentFilter = button.dataset.filter;

        // Move the blue "active" style to the clicked button
        filterButtons.forEach(function (btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        renderTasks();
    });
});

searchInput.addEventListener("input", function () {
    searchQuery = searchInput.value.trim();
    renderTasks();
});

renderTasks();