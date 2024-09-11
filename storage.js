import { Task } from './task.js';

export class Storage {
  static getTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]').map(
      taskData => new Task(taskData._taskId, taskData._task, taskData._status)
    );
    const activeTasks = tasks.filter(task => task.status !== 'completed');
    const completedTasks = tasks.filter(task => task.status === 'completed');
    return [...activeTasks, ...completedTasks];
  }
  static saveNewTask(task) {
    const tasks = this.getTasks();
    tasks.push(task);
    this.saveTasks(tasks);
  }

  static updateTask(updatedTask) {
    const tasks = this.getTasks();
    const index = tasks.findIndex(task => task.taskId === updatedTask.taskId);
    if (index !== -1) {
      tasks[index] = updatedTask;
      //   tasks = this.reorderTasks(tasks);
      this.saveTasks(tasks);
    }
  }

  static deleteTask(taskId) {
    const tasks = this.getTasks().filter(task => task.taskId !== taskId);
    this.saveTasks(tasks);
  }

  static reorderTasks(tasks) {
    const completedTasks = tasks.filter(task => task.status == 'completed');
    const activeTasks = tasks.filter(task => task.status !== 'completed');
    return [...activeTasks, ...completedTasks];
  }

  static saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}
