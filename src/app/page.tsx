"use client";
import { Theme, Flex, Button } from "@radix-ui/themes";
import { Header } from "@/components/layout/Header";
import { MetricCard } from "@/components/layout/MetricCard";
import { getClient } from "@/lib/client";
import { $Objects } from "@kaching/sdk";
import { useEffect, useState, useCallback } from "react";
import useAuthenticated from "@/lib/useAuthenticated";
import {
  BarChartIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  UploadIcon,
  ReloadIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import { TransactionChart } from "@/components/layout/TransactionChart";
import { CategoryTreemap } from "@/components/layout/CategoryTreemap";
<<<<<<< Updated upstream
import { SearchModal } from "@/components/layout/SearchModal";
import { CreateTransactionModal } from "@/components/layout/CreateTransactionModal";
=======
import { Watermark } from "@/components/layout/Watermark";
import { ChatbotInterface } from "@/components/chat/ChatbotInterface";
>>>>>>> Stashed changes

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export default function Home() {
  const authenticated = useAuthenticated();
<<<<<<< Updated upstream
=======
  const [activeTab, setActiveTab] = useState("Line Chart");
>>>>>>> Stashed changes
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalTransactions: 0,
    totalExpenses: 0,
    totalDeposits: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchMetrics = useCallback(async () => {
    if (!authenticated) return;
    setIsLoading(true);

    const client = getClient();
    const transactions = [];

    try {
      for await (const transaction of client(
        $Objects.Transaction
      ).asyncIter()) {
        transactions.push(transaction);
      }

      const totals = transactions.reduce(
        (acc, transaction) => {
          const amount = Number(transaction.amount) || 0;
          if (amount < 0) {
            acc.totalExpenses += Math.abs(amount);
          } else {
            acc.totalDeposits += amount;
          }
          return acc;
        },
        { totalExpenses: 0, totalDeposits: 0 }
      );

      setMetrics({
        totalTransactions: transactions.length,
        totalExpenses: totals.totalExpenses,
        totalDeposits: totals.totalDeposits,
      });
      setTransactions(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [authenticated]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  if (!authenticated) return null;

<<<<<<< Updated upstream
=======
  const renderTabContent = () => {
    switch (activeTab) {
      case "Line Chart":
        return (
          <TransactionChart
            transactions={transactions.map((t) => ({
              date: t.date,
              amount: t.amount,
              description: t.description,
              category: t.category,
            }))}
            isLoading={isLoading}
          />
        );
      case "Categories":
        return (
          <CategoryTreemap
            transactions={transactions.map((t) => ({
              date: t.date,
              amount: t.amount,
              description: t.description,
              category: t.category,
            }))}
            isLoading={isLoading}
          />
        );
      case "Chatbot":
        return (
          <div className="w-full mb-24">
            <div className="mb-4">
              <h2 className="text-2xl font-medium text-gray-900">
                AI Assistant
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Chat with our AI to analyze your spending patterns and get
                financial insights
              </p>
            </div>
            <ChatbotInterface transactions={transactions} />
          </div>
        );
      default:
        return null;
    }
  };

>>>>>>> Stashed changes
  return (
    <Theme>
      <Header
        onSearchClick={() => setIsSearchOpen(true)}
        onReloadClick={fetchMetrics}
        onCreateClick={() => setIsCreateOpen(true)}
      />
      <main className="pt-20 px-4 max-w-7xl mx-auto">
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          transactions={transactions}
        />
        <CreateTransactionModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSuccess={fetchMetrics}
        />
        <Flex gap="4" justify="center" style={{ marginTop: "8px" }}>
          <MetricCard
            title="Total Transactions"
            value={metrics.totalTransactions}
            icon={<BarChartIcon className="w-42 h-42" />}
            iconColor="blue"
            isLoading={isLoading}
          />
          <MetricCard
            title="Total Expenses"
            value={formatCurrency(metrics.totalExpenses)}
            icon={<ArrowDownIcon className="w-42 h-42" />}
            iconColor="red"
            isLoading={isLoading}
          />
          <MetricCard
            title="Total Deposits"
            value={formatCurrency(metrics.totalDeposits)}
            icon={<ArrowUpIcon className="w-42 h-42" />}
            iconColor="green"
            isLoading={isLoading}
          />
        </Flex>
        <TransactionChart
          transactions={transactions.map((t) => ({
            date: t.date,
            amount: t.amount,
            description: t.description,
            category: t.category,
          }))}
          isLoading={isLoading}
        />
        <CategoryTreemap
          transactions={transactions.map((t) => ({
            date: t.date,
            amount: t.amount,
            description: t.description,
            category: t.category,
          }))}
          isLoading={isLoading}
        />
      </main>
    </Theme>
  );
}
