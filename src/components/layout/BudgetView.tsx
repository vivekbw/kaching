import { useState } from "react";
import { formatCurrency } from "@/lib/utils";

interface Transaction {
  date: string;
  amount: number;
  description?: string;
  category?: string;
}

interface BudgetViewProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

export function BudgetView({ transactions, isLoading = false }: BudgetViewProps) {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  if (isLoading) {
    return <div className="animate-pulse h-[400px] bg-gray-100 rounded-lg" />;
  }

  const monthlyTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    const transactionMonth = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}`;
    return transactionMonth === selectedMonth;
  });

  const categoryTotals = monthlyTransactions.reduce((acc, transaction) => {
    const amount = Number(transaction.amount);
    if (amount > 0) {
      const category = transaction.category || "Miscellaneous";
      acc[category] = (acc[category] || 0) + amount;
    }
    return acc;
  }, {} as Record<string, number>);

  const totalSpent = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

  return (
    <div className="w-full mb-24">
      <div className="mb-8">
        <h2 className="text-2xl font-medium text-gray-900">Monthly Budget</h2>
        <p className="text-sm text-gray-500 mt-1">
          Track your monthly spending by category
        </p>
      </div>

      <div className="mb-6">
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Total Spent</h3>
            <span className="text-2xl font-bold text-red-600">
              {formatCurrency(totalSpent)}
            </span>
          </div>
        </div>

        <div className="p-6">
          {Object.entries(categoryTotals)
            .sort(([, a], [, b]) => b - a)
            .map(([category, amount]) => (
              <div
                key={category}
                className="flex justify-between items-center py-3 border-b last:border-0"
              >
                <div>
                  <span className="font-medium">{category}</span>
                  <div className="text-sm text-gray-500">
                    {((amount / totalSpent) * 100).toFixed(1)}% of total
                  </div>
                </div>
                <span className="text-red-600 font-medium">
                  {formatCurrency(amount)}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
} 