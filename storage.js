import { Task } from './task.js';

export class Storage {
  static getTasks() {
    return JSON.parse(localStorage.getItem('tasks') || '[]').map(
      taskData => new Task(taskData._taskId, taskData._task, taskData._status)
    );
  }

  static saveTask(task) {
    const tasks = this.getTasks();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  static updateTask(updatedTask) {
    const tasks = this.getTasks();
    const index = tasks.findIndex(task => task.taskId === updatedTask.taskId);
    if (index !== -1) {
      tasks[index] = updatedTask;
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }

  static deleteTask(taskId) {
    const tasks = this.getTasks().filter(task => task.taskId !== taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}
