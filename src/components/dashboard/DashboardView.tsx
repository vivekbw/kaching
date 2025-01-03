import { useState, useEffect, useMemo } from "react";
import {
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { getClient } from "@/lib/client";
import { $Objects } from "@kaching/sdk";
import { BudgetDetailsModal } from "../modals/budget/BudgetDetailsModal";
import {
  HiOutlineShoppingBag,
  HiOutlineBanknotes,
  HiOutlineCreditCard,
  HiOutlineBuildingOffice2,
  HiOutlineChartBar,
  HiOutlineLightBulb,
} from "react-icons/hi2";

import { LuUtensils } from "react-icons/lu";
import "../charts/TransactionChart.css";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { FaArrowRight } from "react-icons/fa6";
import { RiAiGenerate2 } from "react-icons/ri";

interface DashboardViewProps {
  transactions: any[];
  isLoading?: boolean;
  onTabChange?: (tab: string) => void;
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "electronic transfer":
      return <HiOutlineBanknotes className="w-4 h-4" />;
    case "debt payments":
      return <HiOutlineCreditCard className="w-4 h-4" />;
    case "rent/mortgage":
      return <HiOutlineBuildingOffice2 className="w-4 h-4" />;
    case "dining out":
      return <LuUtensils className="w-4 h-4" />;
    case "investments":
      return <HiOutlineChartBar className="w-4 h-4" />;
    default:
      return <HiOutlineShoppingBag className="w-4 h-4" />;
  }
};

const formatAmount = (amount: number) => {
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}k`;
  }
  return formatCurrency(amount);
};

const SimpleBudgetCard = ({
  budget,
  calculateMonthlyExpenses,
}: {
  budget: any;
  calculateMonthlyExpenses: (monthYear: string) => number;
}) => {
  const monthlyExpenses =
    budget.expenses || calculateMonthlyExpenses(budget.monthYear);
  const budgetValue = Number(budget.currentBudget);
  const percentageUsed = (monthlyExpenses / budgetValue) * 100;

  const formatMonthDisplay = (monthYear: string) => {
    const [year, month] = monthYear.split("-");
    return new Date(`${year}-${month}-01`).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <div className="p-3 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center">
        <span className="font-medium">
          {formatMonthDisplay(budget.monthYear)}
        </span>
        <span
          className={`text-sm font-medium ${
            percentageUsed > 100
              ? "text-red-600"
              : percentageUsed > 80
              ? "text-yellow-600"
              : "text-green-600"
          }`}>
          {percentageUsed.toFixed(0)}%
        </span>
      </div>
      <div className="mt-2">
        <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden">
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
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const date = new Date(data.rawDate);

    return (
      <div className="p-3 rounded-lg shadow-lg border border-gray-200 transaction-tooltip">
        <p className="text-sm text-gray-600">
          {date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <p className="text-sm">{`$${(data.total / 1000).toFixed(1)}k`}</p>
      </div>
    );
  }
  return null;
};

const TitleWithArrow = ({
  title,
  onClick,
}: {
  title: string;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors mb-4">
    <h3 className="text-lg font-medium">{title}</h3>
    <FaArrowRight className="h-[1.125rem] w-[1.125rem]" />
  </div>
);

const AIChatPrompt = ({ onClick }: { onClick: () => void }) => (
  <div
    onClick={onClick}
    className="flex items-center gap-2 pb-4 text-gray-600 hover:text-blue-600 cursor-pointer transition-colors">
    <HiOutlineLightBulb className="w-5 h-5" />
    <span className="text-sm">
      Curious about your finances? Ask our AI chatbot
    </span>
  </div>
);

export function DashboardView({
  transactions,
  isLoading = false,
  onTabChange,
}: DashboardViewProps) {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budgetData, setBudgetData] = useState<any>(null);
  const [currentBudget, setCurrentBudget] = useState("");
  const [existingBudgets, setExistingBudgets] = useState<any[]>([]);

  useEffect(() => {
    const fetchBudgets = async () => {
      const client = getClient();
      const budgets = [];
      try {
        for await (const budget of client($Objects.Budget).asyncIter()) {
          budgets.push(budget);
        }
        setExistingBudgets(budgets);
      } catch (error) {
        console.error("Error fetching budgets:", error);
      }
    };
    fetchBudgets();
  }, []);

  const calculateMonthlyExpenses = (monthYear: string) => {
    const [year, month] = monthYear.split("-");
    return transactions
      .filter((t) => {
        const transactionDate = new Date(t.date);
        return (
          transactionDate.getFullYear() === Number(year) &&
          transactionDate.getMonth() + 1 === Number(month) &&
          Number(t.amount) > 0
        );
      })
      .reduce((total, t) => total + Number(t.amount), 0);
  };

  const formatMonthDisplay = (monthYear: string) => {
    if (!monthYear) return "";
    const [year, month] = monthYear.split("-");
    return new Date(Number(year), Number(month) - 1).toLocaleDateString(
      "en-US",
      {
        month: "long",
        year: "numeric",
      }
    );
  };

  const aggregateData = useMemo(() => {
    const expenseTransactions = transactions
      .filter((t) => Number(t.amount) > 0)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Group by day
    const dailyTotals = expenseTransactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const dayKey = date.toISOString().split("T")[0]; // YYYY-MM-DD format

      if (!acc[dayKey]) {
        acc[dayKey] = {
          rawDate: date.toISOString(),
          total: 0,
        };
      }
      acc[dayKey].total += Number(transaction.amount);
      return acc;
    }, {} as Record<string, { rawDate: string; total: number }>);

    // Convert to array and calculate running total
    let runningTotal = 0;
    return Object.values(dailyTotals)
      .sort(
        (a, b) => new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime()
      )
      .map((entry) => {
        runningTotal += entry.total;
        return {
          rawDate: entry.rawDate,
          total: runningTotal,
        };
      });
  }, [transactions]);

  const categoryTotals = useMemo(() => {
    const totals = transactions.reduce((acc, transaction) => {
      const amount = Number(transaction.amount);
      if (amount > 0) {
        const category = transaction.category || "Uncategorized";
        acc[category] = (acc[category] || 0) + amount;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(totals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  }, [transactions]);

  const vendorTotals = useMemo(() => {
    const totals = transactions.reduce((acc, transaction) => {
      const amount = Number(transaction.amount);
      if (amount > 0) {
        const vendor = transaction.description || "Unknown";
        acc[vendor] = (acc[vendor] || 0) + amount;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(totals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  }, [transactions]);

  const validBudgets = useMemo(() => {
    return existingBudgets
      .filter((budget) => {
        const budgetValue = Number(budget.currentBudget);
        return !isNaN(budgetValue) && budgetValue > 0;
      })
      .sort(
        (a, b) =>
          new Date(b.monthYear).getTime() - new Date(a.monthYear).getTime()
      )
      .slice(0, 3);
  }, [existingBudgets]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="px-0">
      <AIChatPrompt onClick={() => onTabChange?.("Chatbot")} />
      <div className="grid grid-cols-2 gap-4">
        {/* Total Spending Chart */}
        <div className="bg-white p-4 rounded-md shadow-sm ring-1 ring-black/5">
          <TitleWithArrow
            title="Total Spending"
            onClick={() => onTabChange?.("Line Chart")}
          />
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={aggregateData}
                syncId="total-spending"
                margin={{
                  //   top: 5,
                  right: 5,
                  left: 0,
                  //   bottom: 5,
                }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#567CC7" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="rawDate"
                  tickFormatter={(date) => {
                    return new Date(date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  interval={Math.floor(aggregateData.length / 6)}
                  axisLine={false}
                  tickLine={false}
                  style={{
                    fontSize: "12px",
                    opacity: 0.6,
                  }}
                />
                <YAxis
                  tickFormatter={formatAmount}
                  width={45}
                  axisLine={false}
                  tickLine={false}
                  style={{
                    fontSize: "12px",
                    opacity: 0.6,
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#567CC7"
                  strokeWidth={1.5}
                  fill="url(#colorTotal)"
                  dot={false}
                  activeDot={{ r: 6, fill: "#567CC7" }}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Updated Ongoing Budgets section */}
        {validBudgets.length > 0 && (
          <div className="bg-white p-4 rounded-md shadow-sm ring-1 ring-black/5">
            <TitleWithArrow
              title="Ongoing Budgets"
              onClick={() => onTabChange?.("Budget")}
            />
            <div className="space-y-3">
              {validBudgets.map((budget) => (
                <SimpleBudgetCard
                  key={budget.monthYear}
                  budget={budget}
                  calculateMonthlyExpenses={calculateMonthlyExpenses}
                />
              ))}
            </div>
          </div>
        )}

        {/* Top Categories */}
        <div className="bg-white p-4 rounded-md shadow-sm ring-1 ring-black/5">
          <TitleWithArrow
            title="Spending by Category"
            onClick={() => onTabChange?.("Categories")}
          />
          <div className="flex flex-col justify-between h-[200px]">
            {categoryTotals.map(([category, amount], index) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 w-4">{index + 1}</span>
                  <div className="p-2 rounded-full bg-gray-100">
                    {getCategoryIcon(category)}
                  </div>
                  <span className="font-medium">{category}</span>
                </div>
                <span className="font-medium" style={{ color: "#939390" }}>
                  {formatCurrency(amount)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Vendors */}
        <div className="bg-white p-4 rounded-md shadow-sm ring-1 ring-black/5">
          <h3 className="text-lg font-medium mb-4">Spending by Vendor</h3>
          <div className="flex flex-col justify-between h-[200px]">
            {vendorTotals.map(([vendor, amount], index) => (
              <div key={vendor} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 w-4">{index + 1}</span>
                  <span className="font-medium">{vendor}</span>
                </div>
                <span className="font-medium" style={{ color: "#939390" }}>
                  {formatCurrency(amount)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {isModalOpen && budgetData && (
          <BudgetDetailsModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedMonth("");
              setBudgetData(null);
              setCurrentBudget("");
            }}
            monthYear={selectedMonth}
            budgetAmount={Number(budgetData.currentBudget)}
            totalSpent={
              budgetData.expenses || calculateMonthlyExpenses(selectedMonth)
            }
            remainingBudget={
              Number(budgetData.currentBudget) -
              (budgetData.expenses || calculateMonthlyExpenses(selectedMonth))
            }
            percentageUsed={
              ((budgetData.expenses ||
                calculateMonthlyExpenses(selectedMonth)) /
                Number(budgetData.currentBudget)) *
              100
            }
            categoryTotals={Object.entries(
              transactions
                .filter(
                  (t) =>
                    new Date(t.date).toISOString().slice(0, 7) ===
                      selectedMonth && Number(t.amount) > 0
                )
                .reduce((acc, t) => {
                  const category = t.category || "Uncategorized";
                  acc[category] = (acc[category] || 0) + Number(t.amount);
                  return acc;
                }, {} as Record<string, number>)
            ).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})}
            formatMonthDisplay={formatMonthDisplay}
            onBudgetChange={setCurrentBudget}
            onSave={() => {}}
            currentBudget={currentBudget}
          />
        )}
      </div>
    </div>
  );
}
