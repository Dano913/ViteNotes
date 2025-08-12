export type Transaction = {
  id: string;
  amount: number;
  description: string;
  concepto: string;
  category: string;
  date: string |number;
  type: 'income' | 'expense';
  disponible: number;
  [key: string]: any;
  categories?: string[]; // Add this line
};

export interface CategoryBudget {
  category: string;
  idealAmount: number | string;
}

export interface Budget {
  category: any;
  amount: number;
  salary: number;
  savings: number;
  categories: CategoryBudget[];
}

export interface MonthlyChartProps {
  transactions: Transaction[]; // Array of transactions to generate the chart
  startDate?: string;          // Optional: Start date for the chart range
  endDate?: string;            // Optional: End date for the chart range
  chartType?: 'line' | 'bar';  // Optional: Chart type (line or bar, for example)
  showIncome?: boolean;        // Optional: Whether to show income transactions
  showExpenses?: boolean;      // Optional: Whether to show expenses transactions
}

export interface ExpenseDonutChartProps {
  transactions: Transaction[];
  selectedYear?: number;
  selectedMonth?: number;
  selectedCategory?: string;
  selectedType?: string;
  totalExpenses: { [key: string]: number };
}