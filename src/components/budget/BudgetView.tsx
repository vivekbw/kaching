import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { getClient } from "@/lib/client";
import { $Objects, createOrModifyBudget } from "@kaching/sdk";
import toast from "react-hot-toast";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { BudgetDetailsModal } from "../modals/budget/BudgetDetailsModal";
import { CreateBudgetModal } from "../modals/budget/CreateBudgetModal";

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

interface Budget {
  monthYear: string;
  currentBudget: string;
  deposits: number;
  expenses: number;
}

export function BudgetView({
  transactions,
  isLoading = false,
}: BudgetViewProps) {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [currentBudget, setCurrentBudget] = useState("");
  const [budgetData, setBudgetData] = useState<Budget | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [existingBudgets, setExistingBudgets] = useState<Budget[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFetchingBudget, setIsFetchingBudget] = useState(false);
  const [isFetchingAllBudgets, setIsFetchingAllBudgets] = useState(false);

  useEffect(() => {
    async function fetchBudget() {
      const client = getClient();
      try {
        setIsFetchingBudget(true);
        const budgets = [];
        for await (const budget of client($Objects.Budget)
          .where({ monthYear: selectedMonth })
          .asyncIter()) {
          budgets.push(budget);
        }
        if (budgets.length > 0) {
          setBudgetData(budgets[0]);
          setCurrentBudget(budgets[0].currentBudget);
        } else {
          setBudgetData(null);
          setCurrentBudget("");
        }
      } catch (error) {
        console.error("Error fetching budget:", error);
      } finally {
        setIsFetchingBudget(false);
      }
    }
    fetchBudget();
  }, [selectedMonth]);

  useEffect(() => {
    async function fetchAllBudgets() {
      const client = getClient();
      if (!existingBudgets.length) {
        try {
          setIsFetchingAllBudgets(true);
          const budgets = [];
          for await (const budget of client($Objects.Budget).asyncIter()) {
            budgets.push(budget);
          }
          setExistingBudgets(
            budgets.sort((a, b) => b.monthYear.localeCompare(a.monthYear))
          );
        } catch (error) {
          console.error("Error fetching budgets:", error);
        } finally {
          setIsFetchingAllBudgets(false);
        }
      }
    }
    fetchAllBudgets();
  }, [existingBudgets.length]);

  const monthlyTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    const [year, month] = selectedMonth.split("-");
    const budgetDate = new Date(`${year}-${month}-01`);
    return (
      transactionDate.getMonth() === budgetDate.getMonth() &&
      transactionDate.getFullYear() === budgetDate.getFullYear()
    );
  });

  const totalSpent = monthlyTransactions.reduce((sum, t) => {
    return sum + (Number(t.amount) > 0 ? Number(t.amount) : 0);
  }, 0);

  const budgetAmount = Number(currentBudget) || 0;
  const percentageUsed =
    budgetAmount > 0 ? (totalSpent / budgetAmount) * 100 : 0;
  const remainingBudget = budgetAmount - totalSpent;

  const categoryTotals = monthlyTransactions.reduce((acc, transaction) => {
    const amount = Number(transaction.amount);
    if (amount > 0) {
      const category = transaction.category || "Miscellaneous";
      acc[category] = (acc[category] || 0) + amount;
    }
    return acc;
  }, {} as Record<string, number>);

  const formatMonthDisplay = (monthYear: string) => {
    const [year, month] = monthYear.split("-");
    return new Date(`${year}-${month}-01`).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const calculateMonthlyExpenses = (monthYear: string) => {
    return transactions
      .filter((t) => {
        const transactionDate = new Date(t.date);
        const transactionMonth = `${transactionDate.getFullYear()}-${String(
          transactionDate.getMonth() + 1
        ).padStart(2, "0")}`;
        return transactionMonth === monthYear && Number(t.amount) > 0;
      })
      .reduce((sum, t) => sum + Number(t.amount), 0);
  };

  if (isLoading || isFetchingAllBudgets) {
    return (
      <div className="w-full mb-24">
        <div className="mb-8">
          <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-4 w-72 bg-gray-200 rounded-lg mt-1 animate-pulse" />
        </div>

        <div className="mb-6">
          <div className="h-6 w-40 bg-gray-200 rounded-lg mb-4 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-7 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="mt-2 space-y-1">
                  <div className="h-2 bg-gray-200 rounded-full" />
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
            <div className="p-4 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center gap-2">
              <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSaveBudget = async () => {
    const client = getClient();
    try {
      const result = await client(createOrModifyBudget).applyAction(
        {
          Budget: {
            $primaryKey: selectedMonth,
            $apiName: "Budget",
            $objectType: "Budget",
            $title: selectedMonth,
            monthYear: selectedMonth,
          },
          current_budget: currentBudget,
        },
        {
          $returnEdits: true,
        }
      );
      setIsEditing(false);

      // Refresh all budgets after saving
      const allBudgets = [];
      for await (const budget of client($Objects.Budget).asyncIter()) {
        allBudgets.push(budget);
      }
      setExistingBudgets(
        allBudgets.sort((a, b) => b.monthYear.localeCompare(a.monthYear))
      );

      // Show success message
      toast.success(
        `Budget for ${formatMonthDisplay(
          selectedMonth
        )} updated to ${formatCurrency(Number(currentBudget))}`
      );
    } catch (error) {
      console.error("Error saving budget:", error);
      toast.error("Failed to save budget");
    }
  };

  return (
    <div className="w-full mb-24">
      <div className="mb-8">
        <h2 className="text-2xl font-medium text-gray-900">Monthly Budget</h2>
        <p className="text-sm text-gray-500 mt-1">
          Track and manage your monthly spending budget
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-medium text-gray-900 mb-4">
          Existing Budgets
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {existingBudgets
            .filter((budget) => !isNaN(Number(budget.currentBudget)))
            .map((budget) => {
              const monthlyExpenses =
                budget.expenses || calculateMonthlyExpenses(budget.monthYear);
              const percentageUsed =
                (monthlyExpenses / Number(budget.currentBudget)) * 100;

              return (
                <div
                  key={budget.monthYear}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedMonth === budget.monthYear
                      ? "border-black shadow-md"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  onClick={() => {
                    if (selectedMonth === budget.monthYear) {
                      setSelectedMonth("");
                      setBudgetData(null);
                      setCurrentBudget("");
                      setIsModalOpen(false);
                    } else {
                      setSelectedMonth(budget.monthYear);
                      setIsModalOpen(true);
                    }
                  }}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">
                      {formatMonthDisplay(budget.monthYear)}
                    </h3>
                    <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-lg font-bold">
                    {formatCurrency(Number(budget.currentBudget))}
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(percentageUsed, 100)}%` }}
                        transition={{ duration: 0.5 }}
                        className={`absolute top-0 left-0 h-full ${
                          percentageUsed > 100
                            ? "bg-red-500"
                            : percentageUsed > 80
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                      />
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">
                        {formatCurrency(monthlyExpenses)} spent
                      </span>
                      <span
                        className={`font-medium ${
                          percentageUsed > 100
                            ? "text-red-600"
                            : percentageUsed > 80
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}>
                        {percentageUsed.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

          <button
            onClick={() => {
              const today = new Date();
              const nextMonth = new Date(today.setMonth(today.getMonth() + 1));
              setSelectedMonth(
                `${nextMonth.getFullYear()}-${String(
                  nextMonth.getMonth() + 1
                ).padStart(2, "0")}`
              );
              setIsCreateModalOpen(true);
            }}
            className="p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-gray-400 flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 transition-colors">
            <span className="text-xl">+</span>
            <span>Create New Budget</span>
          </button>
        </div>

        {selectedMonth && budgetAmount > 0 && (
          <BudgetDetailsModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedMonth("");
              setBudgetData(null);
              setCurrentBudget("");
            }}
            monthYear={selectedMonth}
            budgetAmount={budgetAmount}
            totalSpent={budgetData?.expenses || totalSpent}
            remainingBudget={
              budgetAmount - (budgetData?.expenses || totalSpent)
            }
            percentageUsed={
              ((budgetData?.expenses || totalSpent) / budgetAmount) * 100
            }
            categoryTotals={categoryTotals}
            formatMonthDisplay={formatMonthDisplay}
            onBudgetChange={setCurrentBudget}
            onSave={handleSaveBudget}
            currentBudget={currentBudget}
          />
        )}

        <CreateBudgetModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setSelectedMonth("");
            setCurrentBudget("");
          }}
          selectedMonth={selectedMonth}
          currentBudget={currentBudget}
          onSave={handleSaveBudget}
          onMonthChange={setSelectedMonth}
          onBudgetChange={setCurrentBudget}
          transactions={transactions}
        />
      </div>
    </div>
  );
}
