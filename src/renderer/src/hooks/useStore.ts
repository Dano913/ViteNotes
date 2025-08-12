import { create } from 'zustand';
import { Event, TaskGroup, DailyTask, Task } from '../types/time';

interface Store {
  events: Event[];
  taskGroups: TaskGroup[];
  dailyTasks: DailyTask[];
  isMonthlyView: boolean;

  // Existing functions
  addEvent: (event: Event) => void;
  addTaskGroup: (group: TaskGroup) => void;
  addDailyTask: (task: DailyTask) => void;
  toggleView: () => void;

  // Functions for editing and deleting events
  updateEvent: (updatedEvent: Event) => void;
  deleteEvent: (eventId: string) => void;

  // Functions for editing and deleting daily tasks
  updateDailyTask: (updatedTask: DailyTask) => void;
  deleteDailyTask: (taskId: string) => void;

  // Function to add a task to a specific group
  addTaskToGroup: (groupId: string, task: Task) => void;

  // New functions for editing task groups and tasks
  updateTaskGroup: (groupId: string, updatedGroup: Partial<TaskGroup>) => void;
  updateTask: (groupId: string, taskId: string, updatedTask: Partial<Task>) => void;
}

export const useStore = create<Store>((set) => ({
  events: [],
  taskGroups: [],
  dailyTasks: [],
  isMonthlyView: true,

  // Existing implementations
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  addTaskGroup: (group) => set((state) => ({ taskGroups: [...state.taskGroups, group] })),
  addDailyTask: (task) => set((state) => ({ dailyTasks: [...state.dailyTasks, task] })),
  toggleView: () => set((state) => ({ isMonthlyView: !state.isMonthlyView })),

  // Implementations for editing and deleting events
  updateEvent: (updatedEvent) => set((state) => ({
    events: state.events.map(event =>
      event.id === updatedEvent.id ? updatedEvent : event
    )
  })),

  deleteEvent: (eventId) => set((state) => ({
    events: state.events.filter(event => event.id !== eventId)
  })),

  // Implementations for editing and deleting daily tasks
  updateDailyTask: (updatedTask) => set((state) => ({
    dailyTasks: state.dailyTasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    )
  })),

  deleteDailyTask: (taskId) => set((state) => ({
    dailyTasks: state.dailyTasks.filter(task => task.id !== taskId)
  })),

  // Implementation to add a task to a specific group
  addTaskToGroup: (groupId, task) => set((state) => ({
    taskGroups: state.taskGroups.map(group =>
      group.id === groupId ? { ...group, tasks: [...group.tasks, task] } : group
    )
  })),

  // New implementation to update a task group
  updateTaskGroup: (groupId, updatedGroup) => set((state) => ({
    taskGroups: state.taskGroups.map(group =>
      group.id === groupId ? { ...group, ...updatedGroup } : group
    )
  })),

  // New implementation to update a task within a group
  updateTask: (groupId, taskId, updatedTask) => set((state) => ({
    taskGroups: state.taskGroups.map(group =>
      group.id === groupId
        ? {
            ...group,
            tasks: group.tasks.map(task =>
              task.id === taskId ? { ...task, ...updatedTask } : task
            )
          }
        : group
    )
  })),
}));
