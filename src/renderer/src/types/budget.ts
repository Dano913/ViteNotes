import { CategoryBudget } from "./expense";

export interface Transaction {
    category: string;
    id: string;
    date: string;
    description: string;
    categories: [];
    amount: number;
    type: 'income' | 'expense';
    disponible: boolean;
  }

  export interface Budget {
    selectedCategory?: string;
    selectedType?: string;
    expenses: { [key: string]: number };
    onSave: (budget: Budget) => void;
    initialBudget?: Budget | null;
    category: any;
      amount: number;
      salary: number;
      savings: number;
      categories: CategoryBudget[];
      budget: Budget;
        selectedYear?: number;
        selectedMonth?: number;
        transactions: Transaction[];
  }

  export interface ExpenseDonutChartProps {
    transactions: Transaction[];
    selectedYear?: number;
    selectedMonth?: number;
    totalExpenses: number;
    selectedCategory?: string;
    selectedType?: string;
    expenses: { [key: string]: number };
  }