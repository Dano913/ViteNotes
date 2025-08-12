export interface Habit {
  id: string;
  name: string;
  description: string;
  icon: string;
  frequency: 'daily' | 'weekly';
  timeOfDay?: 'morning' | 'afternoon' | 'evening';
  createdAt: string;
  color: string;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
  notes?: string;
}

export type HabitWithProgress = Habit & {
  streak: number;
  completedToday: boolean;
  completionRate: number;
};