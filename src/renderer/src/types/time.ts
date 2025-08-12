  export interface TaskGroup {
    color: string; // or import BackgroundColor from the appropriate module
    id: string;
    name: string;
    weeklyHours: number;
    tasks: Task[];
    day: string;
  }
  
  export interface Task {
    duration: number;
    id: string;
    title: string;
    completed: boolean;
    date?: Date;
    name: string;
    day: string;
  }
  
  export interface DailyTask {
    color: string;
    id: string;
    title: string;
    date: Date;
    completed: boolean;
    endDate: Date,
  }

  export interface Event {
    id: string;
    date: Date;
    title: string;
    time: string;
    color: string;
    description?: string;
    clientX?: number;
    clientY?: number;
  }
  
  export interface DayCell {
    date: Date;
    isCurrentMonth: boolean;
    events: Event[];
  }