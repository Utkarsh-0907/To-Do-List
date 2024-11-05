let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function addTodo() {
  const input = document.getElementById("todoInput");
  const text = input.value.trim();

  if (text) {
    const todo = {
      id: Date.now(),
      text: text,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    todos.unshift(todo);
    saveTodos();
    renderTodos();
    input.value = "";
  }
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  todos = todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });
  saveTodos();
  renderTodos();
}

function editTodo(id) {
  const todoElement = document.querySelector(`[data-id="${id}"]`);
  const todoText = todoElement.querySelector(".todo-text");
  const currentText = todoText.textContent;

  const input = document.createElement("input");
  input.type = "text";
  input.value = currentText;
  input.className = "edit-input";

  const saveEdit = () => {
    const newText = input.value.trim();
    if (newText) {
      todos = todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, text: newText };
        }
        return todo;
      });
      saveTodos();
      renderTodos();
    }
  };

  input.addEventListener("blur", saveEdit);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      saveEdit();
    }
  });

  todoText.replaceWith(input);
  input.focus();
}

function filterTodos(filter) {
  currentFilter = filter;
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("active");
    if (btn.textContent.toLowerCase() === filter) {
      btn.classList.add("active");
    }
  });
  renderTodos();
}

function renderTodos() {
  const todoList = document.getElementById("todoList");
  todoList.innerHTML = "";

  let filteredTodos = todos;
  if (currentFilter === "active") {
    filteredTodos = todos.filter((todo) => !todo.completed);
  } else if (currentFilter === "completed") {
    filteredTodos = todos.filter((todo) => todo.completed);
  }

  filteredTodos.forEach((todo) => {
    const todoItem = document.createElement("div");
    todoItem.className = `todo-item ${todo.completed ? "completed" : ""}`;
    todoItem.dataset.id = todo.id;

    todoItem.innerHTML = `
                    <input type="checkbox" ${todo.completed ? "checked" : ""} 
                           onclick="toggleTodo(${todo.id})">
                    <span class="todo-text">${todo.text}</span>
                    <div class="todo-actions">
                        <button onclick="editTodo(${todo.id})">Edit</button>
                        <button class="delete-btn" onclick="deleteTodo(${
                          todo.id
                        })">Delete</button>
                    </div>
                `;

    todoList.appendChild(todoItem);
  });
}

renderTodos();

document.getElementById("todoInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTodo();
  }
});
