let todoItems = [];
const form = document.querySelector('.js-form');
const list = document.querySelector('.js-todo-list');
const doneList = document.querySelector('.js-done-list');
const doneTasks = document.querySelector('.done-tasks');

function renderTodo(todo) {
  localStorage.setItem('todoItemsRef', JSON.stringify(todoItems));

  const isChecked = todo.checked ? 'done' : '';
  const item = document.querySelector(`[data-key='${todo.id}']`);
  const node = document.createElement('li');

  node.setAttribute('class', `todo-item ${isChecked}`);
  node.setAttribute('data-key', todo.id);
  node.innerHTML = `
    <input id="${todo.id}" type="checkbox" class='tick js-tick'/>
    <span class="tick js-tick"></span>
    <label for="${todo.id}" class="todo-text">${todo.text}</label>
    <div class='buttons-container'>
      <button class="delete-todo js-delete-todo"></button>
      <button class="edit-todo js-edit-todo"></button>
    </div>
 
  `;

  if (todo.deleted) {
    item.remove();
    return;
  }

  if (item) {
    list.replaceChild(node, item);
  } else {
    list.append(node);
  }
}

// função para criar um objeto to-do e colocá-lo numa array vazia
function addTodo(text) {
  const todo = {
    text,
    checked: false,
    id: Date.now(),
  };

  todoItems.push(todo);
  renderTodo(todo);
}

// aplicando a função addTodo ao evento submit
function handleSubmit(event) {
  event.preventDefault();
  const input = document.querySelector('.js-todo-input');
  const text = input.value.trim();
  if (text !== '') {
    addTodo(text);
    input.value = '';
    input.focus();
  }
}

form.addEventListener('submit', handleSubmit);

// escutando o clique para alterar a propriedade "checked" dos objetos to-do (função toggleDone) ou deletá-los (função deleteTodo)
function handleListClick(event) {
  if (event.target.classList.contains('js-tick')) {
    const itemKey = event.target.parentElement.dataset.key;
    toggleDone(itemKey);
  }

  if (event.target.classList.contains('js-delete-todo')) {
    const itemKey = event.target.parentElement.parentElement.dataset.key;
    deleteTodo(itemKey);
  }
}

function toggleDone(key) {
  const index = todoItems.findIndex((item) => item.id === Number(key));

  todoItems[index].checked = !todoItems[index].checked;
  renderTodo(todoItems[index]);
}

function deleteTodo(key) {
  const index = todoItems.findIndex((item) => item.id === Number(key));

  const todo = {
    deleted: true,
    ...todoItems[index],
  };

  todoItems = todoItems.filter((item) => item.id !== Number(key));
  renderTodo(todo);
}

list.addEventListener('click', handleListClick);

// armazenando os to-dos no local storage

document.addEventListener('DOMContentLoaded', () => {
  const ref = localStorage.getItem('todoItemsRef');
  if (ref) {
    todoItems = JSON.parse(ref);
    todoItems.forEach((t) => {
      renderTodo(t);
    });
  }
});

// função para exibir (ou ocultar) o empty state prompt caso a lista esteja vazia

function emptyStateInit() {
  const emptyPrompt = document.querySelector('.empty-state');
  const listIsEmpty = list.innerHTML == '';
  const pending = document.querySelector('.pending');
  const pendingCounter = document.querySelector('.pending-counter');
  const pendingFilter = todoItems.filter((item) => {
    return item.checked === false;
  }).length;

  if (listIsEmpty) {
    emptyPrompt.classList.add('show');
    pending.classList.remove('show');
  } else {
    emptyPrompt.classList.remove('show');
    pending.classList.add('show');
    pendingCounter.innerHTML = `(${pendingFilter})`;
  }
}

document.addEventListener('click', emptyStateInit);
form.addEventListener('submit', emptyStateInit);
document.addEventListener('DOMContentLoaded', emptyStateInit);

// função para exibir (ou ocultar) a tela "Tudo Pronto" caso todas as tarefas tenham sido cumpridas

function allDoneInit() {
  const allDone = document.querySelector('.all-done');
  const tasksAreDone = todoItems.every((item) => item.checked === true);
  const listIsntEmpty = todoItems.length !== 0;

  if (tasksAreDone && listIsntEmpty) {
    allDone.classList.add('show');
  } else {
    allDone.classList.remove('show');
  }
}

document.addEventListener('click', allDoneInit);
form.addEventListener('submit', allDoneInit);
document.addEventListener('DOMContentLoaded', allDoneInit);
