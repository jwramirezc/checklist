const taskForm = document.getElementById('form-info');
const taskList = document.getElementById('task-list');
const tasks = taskList.querySelectorAll('.task');
const btnCheck = document.getElementById('check-task');
// loadTasksFromLocalStorage();

//objeto de las tareas con características

taskForm.addEventListener('submit', event => {
  event.preventDefault();
  const taskInput = document.getElementById('insert-task');
  const task = taskInput.value;
  //   console.log(task);
  if (task) {
    // storeTaskInLocalStorage(task);
    createTaskElement(task);
  }
  taskInput.value = '';
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
}

//Creando el evento click para el botón check tarea
taskList.addEventListener('click', event => {
  //   console.log(event.target);
  if (event.target.classList.contains('fa-circle')) {
    const currentTask = event.target.closest('.task');
    taskList.appendChild(currentTask);
    checkTask(currentTask);
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
});

//Creando los estilos de una tarea completada
function checkTask(currentTask) {
  currentTask.querySelector('p.task-text-content').style.textDecoration =
    'line-through';
  currentTask.querySelector('p.task-text-content').style.opacity = '0.5';
  currentTask.querySelector('i.fa-circle').className =
    'fa-regular fa-circle-dot';
}

//Eliminando tareas definitivamente
function deleteTask(currentTask) {
  if (confirm('Está seguro de eliminar la tarea?')) {
    taskList.removeChild(currentTask);
  }
}

//Editar tareas
function editTask(currentTask) {
  //   const currentTask = event.target.closest('.task');
  let oldText = currentTask.querySelector('p.task-text-content').textContent;
  let newText = prompt(`Ingrese el nuevo texto de la tarea`, oldText);
  currentTask.querySelector('p.task-text-content').textContent = newText;
}

//Guardando los cambios en localStorage

function storeTaskInLocalStorage(task) {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// //Cargando las tareas guardadas en localStorage

function loadTasksFromLocalStorage() {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

  console.log(tasks);
  tasks.forEach(task => {
    createTaskElement(task); //Creando las tareas
    console.log(task);
  });
}

// function updateLocalStorage() {
//   const tasks = Array.from(taskList.querySelectorAll('li')).map(
//     li => li.querySelectorAll('p.task-text-content').textContent
//   );
//   localStorage.setItem('tasks', JSON.stringify(tasks));
// }

// function updateLocalStorage() {
//   const tasks = [];
//   taskList.querySelectorAll('li').forEach(li => {
//     const taskText = li.querySelector('p.task-text-content').textContent;
//     tasks.push(taskText);
//   });
//   localStorage.setItem('tasks', JSON.stringify(tasks));
// }
