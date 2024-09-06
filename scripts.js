const taskForm = document.getElementById('form-info');
const taskList = document.getElementById('task-list');
const tasks = taskList.querySelectorAll('.task');
const btnCheck = document.getElementById('check-task');
const changeTheme = document.getElementById('btn-toogle-theme');
const mainClass = document.querySelector('main');

loadTasksFromLocalStorage();

changeTheme.addEventListener('click', change);

//cambiando el tema de la aplicación
function change() {
  mainClass.classList.toggle('dark-mode');
  const theme = mainClass.classList.contains('dark-mode') ? 'dark' : 'light';
  localStorage.setItem('theme', theme);
}

if (localStorage.getItem('theme') === 'dark') {
  mainClass.classList.add('dark-mode');
} else {
  mainClass.classList.remove('dark-mode');
}

//constructor de las tareas con características
function Task(taskId, task, status) {
  this.taskId = taskId;
  this.task = task;
  this.status = status;
}
taskForm.addEventListener('submit', event => {
  event.preventDefault();
  const taskInput = document.getElementById('insert-task');
  const task = taskInput.value;
  //   console.log(task);
  if (task) {
    createTaskElement(task);
  }
  taskInput.value = '';
  taskInput.focus();
});

//Creando una nueva tarea
function createTaskElement(task) {
  // Crear un nuevo elemento li
  const newLi = document.createElement('li');
  newLi.className = 'task';

  // Agregar los elementos hijos al nuevo elemento li

  //Agregando el radio button inicial
  const newTaskButton = document.createElement('button');
  newTaskButton.id = 'check-task';
  newTaskButton.className = 'btn-task';
  newTaskButton.innerHTML = '<i class="fa-regular fa-circle"></i>';
  newLi.append(newTaskButton);

  //Agregando el texto de la tarea
  const newTaskContent = document.createElement('p');
  newTaskContent.className = 'task-text-content';
  newTaskContent.textContent = task;
  newLi.append(newTaskContent);

  //Agregando el  button eliminar
  const newTaskButtonDelete = document.createElement('button');
  newTaskButtonDelete.className = 'btn-task';
  newTaskButtonDelete.innerHTML = '<i class="fa-solid fa-delete-left">';
  newLi.append(newTaskButtonDelete);

  //Agregando el  button editar
  const newTaskButtonEdit = document.createElement('button');
  newTaskButtonEdit.className = 'btn-task';
  newTaskButtonEdit.innerHTML = '<i class="fa-solid fa-pencil">';
  newLi.append(newTaskButtonEdit);

  //Agregando el nuevo elemento li al ul en la primera posición
  taskList.prepend(newLi);

  const taskId = Math.floor(Math.random() * 1000) + 1;
  const newTask = new Task(taskId, task, 'active');

  // Asigno el código único al elemento LI
  newLi.dataset.id = taskId;
  storeTaskInLocalStorage(newTask);
  return newTask;
}
//Creando el evento click para el botón check tarea
taskList.addEventListener('click', event => {
  //   console.log(event.target);
  if (event.target.classList.contains('fa-circle')) {
    const currentTask = event.target.closest('.task');
    checkTask(currentTask);
    taskList.appendChild(currentTask);
  } else if (
    event.target.classList.contains('fa-delete-left') ||
    event.target.classList.contains('fa-pencil')
  ) {
    const currentTask = event.target.closest('.task');
    if (event.target.classList.contains('fa-delete-left')) {
      deleteTask(currentTask);
    } else if (event.target.classList.contains('fa-pencil')) {
      const currentTask = event.target.closest('.task');
      editTask(currentTask);
      //   updateLocalStorage();
    }
  }
  const taskInput = document.getElementById('insert-task');
  taskInput.focus();
});

//Creando los estilos de una tarea completada
function checkTask(currentTask) {
  const taskStorage = JSON.parse(localStorage.getItem('tasks') || '[]');
  const taskId = currentTask.dataset.id;

  for (let i = 0; i < taskStorage.length; i++) {
    if (taskStorage[i].taskId == taskId) {
      taskStorage[i].status = 'completed';
      break;
    }
  }

  localStorage.setItem('tasks', JSON.stringify(taskStorage));

  currentTask.querySelector('p.task-text-content').style.textDecoration =
    'line-through';
  currentTask.querySelector('p.task-text-content').style.opacity = '0.5';
  currentTask.querySelector('i.fa-circle').className =
    'fa-regular fa-circle-dot';
}
//Eliminando tareas definitivamente
function deleteTask(currentTask) {
  if (confirm('Está seguro de eliminar la tarea?')) {
    const taskStorage = JSON.parse(localStorage.getItem('tasks') || '[]');
    const taskId = currentTask.dataset.id;

    for (let i = 0; i < taskStorage.length; i++) {
      if (taskStorage[i].taskId == taskId) {
        taskStorage.splice(i, 1); // Elimina la instancia con id igual a taskId
        break;
      }
    }
    taskList.removeChild(currentTask);
    localStorage.setItem('tasks', JSON.stringify(taskStorage));
  }
}
//Editar tareas
function editTask(currentTask) {
  let oldText = currentTask.querySelector('p.task-text-content').textContent;
  let newText = prompt(`Ingrese el nuevo texto de la tarea`, oldText);
  currentTask.querySelector('p.task-text-content').textContent = newText;

  const taskStorage = JSON.parse(localStorage.getItem('tasks') || '[]');
  const taskId = currentTask.dataset.id;

  for (let i = 0; i < taskStorage.length; i++) {
    if (taskStorage[i].taskId == taskId) {
      taskStorage[i].task = newText;
      break;
    }
  }
  localStorage.setItem('tasks', JSON.stringify(taskStorage));
}

//Guardando los cambios en localStorage
function storeTaskInLocalStorage(newTask) {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  tasks.push(newTask);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

//Cargando las tareas guardadas desde localStorage

function loadTasksFromLocalStorage() {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

  console.log(tasks);
  tasks.forEach(task => {
    // Crear un nuevo elemento li
    const newLi = document.createElement('li');
    newLi.className = 'task';

    // Agregar los elementos hijos al nuevo elemento li

    //Agregando el radio button inicial
    const newTaskButton = document.createElement('button');
    newTaskButton.id = 'check-task';
    newTaskButton.className = 'btn-task';

    if (task.status == 'completed') {
      newTaskButton.innerHTML = '<i class="fa-regular fa-circle-dot"></i>';
    } else {
      newTaskButton.innerHTML = '<i class="fa-regular fa-circle"></i>';
    }

    newLi.append(newTaskButton);

    //Agregando el texto de la tarea
    const newTaskContent = document.createElement('p');
    newTaskContent.className = 'task-text-content';

    if (task.status == 'completed') {
      newTaskContent.textContent = task.task;
      newTaskContent.style.textDecoration = 'line-through';
      newTaskContent.style.opacity = '0.5';
    } else {
      newTaskContent.textContent = task.task;
    }

    newLi.append(newTaskContent);

    //Agregando el  button eliminar
    const newTaskButtonDelete = document.createElement('button');
    newTaskButtonDelete.className = 'btn-task';
    newTaskButtonDelete.innerHTML = '<i class="fa-solid fa-delete-left">';
    newLi.append(newTaskButtonDelete);

    //Agregando el  button editar
    const newTaskButtonEdit = document.createElement('button');
    newTaskButtonEdit.className = 'btn-task';
    newTaskButtonEdit.innerHTML = '<i class="fa-solid fa-pencil">';
    newLi.append(newTaskButtonEdit);

    //Agregando el nuevo elemento li al ul en la primera posición
    taskList.prepend(newLi);

    const taskId = task.taskId;
    const newTask = new Task(taskId, task.task, task.status);

    // Asigno el código único al elemento LI
    newLi.dataset.id = taskId;
    // storeTaskInLocalStorage(newTask);
    return newTask;
  });
}
function updateLocalStorage(taskUpdated) {
  console.log(taskUpdated);
  const tasks = [];
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
