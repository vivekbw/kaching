"use client";
import { Theme, Flex } from "@radix-ui/themes";
import { Header } from "@/components/layout/Header";
import { MetricCard } from "@/components/layout/MetricCard";
import { getClient } from "@/lib/client";
import { $Objects } from "@kaching/sdk";
import { useEffect, useState } from "react";
import useAuthenticated from "@/lib/useAuthenticated";
import { BarChartIcon, ArrowUpIcon, ArrowDownIcon } from "@radix-ui/react-icons";
import { TransactionChart } from "@/components/layout/TransactionChart";

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export default function Home() {
  const authenticated = useAuthenticated();
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalTransactions: 0,
    totalExpenses: 0,
    totalDeposits: 0,
  });
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function fetchMetrics() {
      if (!authenticated) return;
      setIsLoading(true);

      const client = getClient();
      const transactions = [];
      
      try {
        for await (const transaction of client($Objects.Transaction).asyncIter()) {
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
    }

    fetchMetrics();
  }, [authenticated]);

  if (!authenticated) return null;

  return (
    <Theme>
      <Header />
      <main className="pt-20 px-4 max-w-7xl mx-auto">
        <Flex gap="4" justify="center">
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
          transactions={transactions.map(t => ({
            date: t.date,
            amount: t.amount,
            description: t.description,
            category: t.category
          }))}
          isLoading={isLoading} 
        />
      </main>
    </Theme>
  );
}
