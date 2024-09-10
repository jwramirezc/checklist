export class Task {
  constructor(taskId, task, status = 'active') {
    this._taskId = taskId;
    this._task = task;
    this._status = status;
  }

  get taskId() {
    return this._taskId;
  }
  get task() {
    return this._task;
  }
  get status() {
    return this._status;
  }

  set task(value) {
    this._task = value;
  }
  set status(value) {
    this._status = value;
  }

  complete() {
    this.status = 'completed';
  }

  edit(newText) {
    this.task = newText;
  }

  toJSON() {
    return {
      _taskId: this.taskId,
      _task: this.task,
      _status: this.status,
    };
  }
}

// ui.js
export class UI {
  static createTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'task';
    li.dataset.id = task.taskId;

    li.innerHTML = `
        <button id="check-task" class="btn-task">
          <i class="fa-regular ${
            task.status === 'completed' ? 'fa-circle-dot' : 'fa-circle'
          }"></i>
        </button>
        <p class="task-text-content ${
          task.status === 'completed' ? 'completed' : ''
        }">${task.task}</p>
        <button class="btn-task">
          <i class="fa-solid fa-delete-left"></i>
        </button>
        <button class="btn-task">
          <i class="fa-solid fa-pencil"></i>
        </button>
      `;

    return li;
  }

  static updateTaskElement(taskElement, task) {
    const textElement = taskElement.querySelector('.task-text-content');
    const checkElement = taskElement.querySelector('#check-task i');

    textElement.textContent = task.task;
    textElement.classList.toggle('completed', task.status === 'completed');
    checkElement.className = `fa-regular ${
      task.status === 'completed' ? 'fa-circle-dot' : 'fa-circle'
    }`;
  }

  static deleteTaskElement(taskElement) {
    taskElement.remove();
  }

  static appendTask(taskList, taskElement) {
    taskList.prepend(taskElement);
  }

  static clearInput(input) {
    input.value = '';
    input.focus();
  }

  static toggleTheme(mainElement) {
    mainElement.classList.toggle('dark-mode');
    const theme = mainElement.classList.contains('dark-mode')
      ? 'dark'
      : 'light';
    localStorage.setItem('theme', theme);
  }

  static loadTheme(mainElement) {
    if (localStorage.getItem('theme') === 'dark') {
      mainElement.classList.add('dark-mode');
    }
  }
}
