const presetValues = [
  {
    title: "Wake up at 5am",
    completed: true,
  },
  {
    title: "Learn how to use Vue.js",
    completed: false,
  },
  {
    title: "Drink coffee",
    completed: false,
  },
];

document.addEventListener("DOMContentLoaded", function () {
  const newTodoInput = document.querySelector(".new-todo");
  const newTodoButton = document.querySelector(".new-todo-button");
  const todoList = document.querySelector(".todo-list");
  const toggleAllCheckbox = document.getElementById("toggle-all");
  const clearCompletedButton = document.querySelector(".clear-completed");
  const todoCount = document.querySelector(".todo-count strong");
  const filters = document.querySelectorAll(".filters li a");

  let todos = JSON.parse(localStorage.getItem("todo-app")) || presetValues;
  let uid = todos.length;

  function updateTodos() {
    localStorage.setItem("todo-app", JSON.stringify(todos));
    renderTodoList();
  }

  function renderTodoList() {
    const selectedFilter = document.querySelector(".filters li a.selected");
    const filterValue = selectedFilter.dataset.filter;

    const filteredTodos = todos.filter((todo) => {
      if (filterValue === "completed") {
        return todo.completed;
      } else if (filterValue === "active") {
        return !todo.completed;
      } else {
        return true; // Show all todos if filterValue is not 'completed' or 'active'
      }
    });

    todoList.innerHTML = "";
    let activeCount = 0;
    filteredTodos.forEach((todo, index) => {
      const li = document.createElement("li");
      li.setAttribute("data-id", index);
      li.className = `todo ${todo.completed ? "completed" : ""}`;
      li.innerHTML = `
        <div class="view">
          <input class="toggle" type="checkbox" ${
            todo.completed ? "checked" : ""
          }>
          <label>${todo.title}</label>
          <button class="destroy"></button>
        </div>
        <input class="edit" type="text" value="${todo.title}">
      `;
      todoList.appendChild(li);
      if (!todo.completed) {
        activeCount++;
      }
    });

    todoCount.textContent =
      filterValue === "completed"
        ? filteredTodos.length - activeCount
        : activeCount;
  }

  function addTodo() {
    const value = newTodoInput.value.trim();
    if (!value) {
      return;
    }
    todos.push({
      id: uid++,
      title: value,
      completed: false,
    });
    newTodoInput.value = "";
    updateTodos();
  }

  function removeTodo(index) {
    todos.splice(index, 1);
    updateTodos();
  }

  function toggleTodoCompletion(index) {
    todos[index].completed = !todos[index].completed;
    updateTodos();
  }

  function clearCompleted() {
    todos = todos.filter((todo) => !todo.completed);
    updateTodos();
  }

  function editTodoTitle(index, newTitle) {
    todos[index].title = newTitle;
    updateTodos();
  }

  function handleToggleAll() {
    const allDone = toggleAllCheckbox.checked;
    todos.forEach((todo) => (todo.completed = allDone));
    updateTodos();
  }

  newTodoButton.addEventListener("click", addTodo);
  newTodoInput.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
      addTodo();
    }
  });
  todoList.addEventListener("click", (event) => {
    const target = event.target;
    if (target.classList.contains("destroy")) {
      const todoItem = target.closest(".todo");
      const id = todoItem.dataset.id;
      removeTodo(id);
    } else if (target.classList.contains("toggle")) {
      const todoItem = target.closest(".todo");
      const id = todoItem.dataset.id;
      toggleTodoCompletion(id);
    }
  });
  todoList.addEventListener("dblclick", (event) => {
    const target = event.target;
    if (target.tagName === "LABEL") {
      const todoItem = target.closest(".todo");
      todoItem.classList.add("editing");
      const input = todoItem.querySelector(".edit");
      input.focus();
    }
  });
  todoList.addEventListener("keyup", (event) => {
    const target = event.target;
    if (event.keyCode === 13) {
      if (target.classList.contains("edit")) {
        const todoItem = target.closest(".todo");
        const id = todoItem.dataset.id;
        editTodoTitle(id, target.value);
        todoItem.classList.remove("editing");
      }
    } else if (event.keyCode === 27) {
      if (target.classList.contains("edit")) {
        const todoItem = target.closest(".todo");
        todoItem.classList.remove("editing");
        target.value = todos[todoItem.dataset.id].title;
      }
    }
  });
  toggleAllCheckbox.addEventListener("change", handleToggleAll);
  clearCompletedButton.addEventListener("click", clearCompleted);

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      filters.forEach((f) => f.classList.remove("selected"));
      filter.classList.add("selected");
      renderTodoList();
    });
  });

  renderTodoList();
});
