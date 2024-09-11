import { Task } from './task.js';
import { UI } from './ui.js';
import { Storage } from './storage.js';

class TodoApp {
  constructor() {
    this.taskForm = document.getElementById('form-info');
    this.taskList = document.getElementById('task-list');
    this.taskInput = document.getElementById('insert-task');
    this.changeTheme = document.getElementById('btn-toogle-theme');
    this.mainElement = document.querySelector('main');
    this.deleteAll = document.getElementById('btn-delete-all');

    this.initEventListeners();
    this.loadTasks();
    UI.loadTheme(this.mainElement);
  }

  initEventListeners() {
    this.taskForm.addEventListener('submit', this.handleNewTask.bind(this));
    this.taskList.addEventListener('click', this.handleTaskAction.bind(this));
    this.deleteAll.addEventListener('click', this.deleteAllTask.bind(this));
    this.changeTheme.addEventListener('click', () =>
      UI.toggleTheme(this.mainElement)
    );
  }

  async loadTasks() {
    const tasks = await Storage.getTasks();
    const fragment = document.createDocumentFragment();
    tasks.forEach(task => {
      const element = UI.createTaskElement(task);
      fragment.appendChild(element);
    });
    this.taskList.appendChild(fragment);
    UI.showDeleteButton(this.deleteAll);
  }

  handleNewTask(event) {
    event.preventDefault();
    const taskText = this.taskInput.value.trim();
    if (taskText) {
      const taskId = Date.now();
      const newTask = new Task(taskId, taskText);
      this.addTask(newTask);
    }
    UI.clearInput(this.taskInput);
  }

  deleteAllTask() {
    if (confirm('¿Está seguro de eliminar todas las tareas?')) {
      console.log('Eliminando tareas');
      const tasks = Storage.getTasks();
      tasks.forEach(task => {
        Storage.deleteTask(task.taskId);
      });
    }
    location.reload();
  }

  addTask(task) {
    const taskElement = UI.createTaskElement(task);
    UI.appendTask(this.taskList, taskElement);
    Storage.saveNewTask(task);
    UI.showDeleteButton(this.deleteAll);
  }

  handleTaskAction(event) {
    const target = event.target;
    const taskElement = target.closest('.task');
    if (!taskElement) return;

    const taskId = parseInt(taskElement.dataset.id);
    const task = Storage.getTasks().find(t => t.taskId === taskId);

    if (
      target.classList.contains('fa-circle') ||
      target.classList.contains('fa-circle-dot')
    ) {
      this.toggleTaskComplete(task, taskElement);
    } else if (target.classList.contains('fa-delete-left')) {
      this.deleteTask(taskId, taskElement);
    } else if (target.classList.contains('fa-pencil')) {
      this.editTask(task, taskElement);
    }
  }

  toggleTaskComplete(task, taskElement) {
    task.status = task.status === 'active' ? 'completed' : 'active';
    UI.updateTaskElement(taskElement, task);
    Storage.updateTask(task);
    if (task.status === 'completed') {
      this.taskList.appendChild(taskElement);
    }
  }

  deleteTask(taskId, taskElement) {
    if (confirm('¿Está seguro de eliminar la tarea?')) {
      UI.deleteTaskElement(taskElement);
      Storage.deleteTask(taskId);
    }
  }

  editTask(task, taskElement) {
    const newText = prompt('Ingrese el nuevo texto de la tarea', task.task);
    if (newText && newText.trim() !== '') {
      task.edit(newText.trim());
      UI.updateTaskElement(taskElement, task);
      Storage.updateTask(task);
    }
  }

  reorderTaskElements() {
    const tasks = Storage.getTasks();
    const fragment = document.createDocumentFragment();
    tasks.forEach(task => {
      const existingElement = this.taskList.querySelector(
        `[data-id="${task.taskId}"]`
      );
      if (existingElement) {
        fragment.appendChild(existingElement);
      } else {
        const newElement = UI.createTaskElement(task);
        fragment.appendChild(newElement);
      }
    });
    this.taskList.innerHTML = '';
    this.taskList.appendChild(fragment);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new TodoApp();
});
