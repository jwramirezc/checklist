const taskForm = document.getElementById('form-info');
const taskList = document.getElementById('task-list');
const tasks = taskList.querySelectorAll('.task');
const btnCheck = document.getElementById('check-task');
const changeTheme = document.getElementById('btn-toogle-theme');
const mainClass = document.querySelector('main');

//evento click con la nueva tarea del input
taskForm.addEventListener('submit', event => {
  event.preventDefault();
  const taskInput = document.getElementById('insert-task');
  const task = taskInput.value;
  if (task) {
    new Task().createTaskElement(task);
  }
  taskInput.value = '';
  taskInput.focus();
});

//clase de la tarea
class Task {
  constructor(taskId, task, status) {
    this._taskId = taskId;
    this._task = task;
    this._status = status;
  }

  createTaskElement(task) {
    const taskId = Math.floor(Math.random() * 1000) + 1;
    const newTask = new Task(taskId, task, 'active');

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

    // Asigno el código único al elemento LI
    newLi.dataset.id = taskId;
    new Task().storeTaskInLocalStorage(newTask);
    return newTask;
  }
  updateTaskElement(currentTask, { checkTask, editTask, deleteTask }) {
    const taskStorage = JSON.parse(localStorage.getItem('tasks') || '[]');
    const taskId = currentTask.dataset.id;

    for (let i = 0; i < taskStorage.length; i++) {
      if (taskStorage[i]._taskId == taskId) {
        if (checkTask) {
          taskStorage[i]._status = 'completed';
          currentTask.querySelector(
            'p.task-text-content'
          ).style.textDecoration = 'line-through';
          currentTask.querySelector('p.task-text-content').style.opacity =
            '0.5';
          currentTask.querySelector('i.fa-circle').className =
            'fa-regular fa-circle-dot';
        } else if (editTask) {
          let oldText = currentTask.querySelector(
            'p.task-text-content'
          ).textContent;
          let newText = prompt(`Ingrese el nuevo texto de la tarea`, oldText);
          currentTask.querySelector('p.task-text-content').textContent =
            newText;
          taskStorage[i]._task = newText;
        } else {
          if (confirm('Está seguro de eliminar la tarea?')) {
            for (let i = 0; i < taskStorage.length; i++) {
              if (taskStorage[i]._taskId == taskId) {
                taskStorage.splice(i, 1); // Elimina la instancia con id igual a taskId
              }
            }
            taskList.removeChild(currentTask);
          }
        }
      }
    }
    localStorage.setItem('tasks', JSON.stringify(taskStorage));
  }

  deleteTaskElement(currentTask) {
    if (confirm('Está seguro de eliminar la tarea?')) {
      const taskStorage = JSON.parse(localStorage.getItem('tasks') || '[]');
      const taskId = currentTask.dataset.id;

      for (let i = 0; i < taskStorage.length; i++) {
        if (taskStorage[i]._taskId == taskId) {
          taskStorage.splice(i, 1); // Elimina la instancia con id igual a taskId
          break;
        }
      }
      taskList.removeChild(currentTask);
      localStorage.setItem('tasks', JSON.stringify(taskStorage));
    }
  }

  loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const completedTasks = tasks.filter(task => task._status == 'completed');
    const activeTasks = tasks.filter(task => task._status !== 'completed');
    const tasksOrdered = [...activeTasks, ...completedTasks].sort((a, b) =>
      a._status === 'completed' ? -1 : b._status !== 'completed' ? 1 : 0
    );

    tasksOrdered.forEach(task => {
      // Crear un nuevo elemento li
      const newLi = document.createElement('li');
      newLi.className = 'task';

      // Agregar los elementos hijos al nuevo elemento li

      //Agregando el radio button inicial
      const newTaskButton = document.createElement('button');
      newTaskButton.id = 'check-task';
      newTaskButton.className = 'btn-task';

      if (task._status == 'completed') {
        newTaskButton.innerHTML = '<i class="fa-regular fa-circle-dot"></i>';
      } else {
        newTaskButton.innerHTML = '<i class="fa-regular fa-circle"></i>';
      }
      newLi.append(newTaskButton);

      //Agregando el texto de la tarea
      const newTaskContent = document.createElement('p');
      newTaskContent.className = 'task-text-content';

      if (task._status == 'completed') {
        newTaskContent.textContent = task._task;
        newTaskContent.style.textDecoration = 'line-through';
        newTaskContent.style.opacity = '0.5';
      } else {
        newTaskContent.textContent = task._task;
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

      const taskId = task._taskId;
      const newTask = new Task(taskId, task._task, task._status);

      // Asigno el código único al elemento LI
      newLi.dataset.id = taskId;
      return newTask;
    });
  }

  //Guardando los cambios en localStorage
  storeTaskInLocalStorage(newTask) {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  get id() {
    return this._id;
  }

  get status() {
    return this._status;
  }

  set status(newStatus) {
    this._status = newStatus;
  }
}

new Task().loadTasksFromLocalStorage();

//evento click para el botón las opciones de la tarea (check-editar-eliminar)
taskList.addEventListener('click', event => {
  //   console.log(event.target);
  if (event.target.classList.contains('fa-circle')) {
    const currentTask = event.target.closest('.task');
    new Task().updateTaskElement(currentTask, {
      checkTask: true,
      editTask: false,
      deleteTask: false,
    });

    taskList.appendChild(currentTask);
  } else if (
    event.target.classList.contains('fa-delete-left') ||
    event.target.classList.contains('fa-pencil')
  ) {
    const currentTask = event.target.closest('.task');
    if (event.target.classList.contains('fa-delete-left')) {
      new Task().updateTaskElement(currentTask, {
        checkTask: false,
        editTask: false,
        deleteTask: true,
      });
    } else if (event.target.classList.contains('fa-pencil')) {
      const currentTask = event.target.closest('.task');
      new Task().updateTaskElement(currentTask, {
        checkTask: false,
        editTask: true,
        deleteTask: false,
      });
    }
  }
  const taskInput = document.getElementById('insert-task');
  taskInput.focus();
});

//cambiando el tema de la aplicación

changeTheme.addEventListener('click', change);

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
