import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Brush,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { useEffect, useRef } from "react";
import "./TransactionChart.css";
import { ChartSkeleton } from "./ChartSkeleton";

interface Transaction {
  date: string;
  amount: number;
  description?: string;
  category?: string;
}

interface TransactionChartProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

export function TransactionChart({
  transactions,
  isLoading = false,
}: TransactionChartProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const dailyTotals = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = {
        rawDate: transaction.date,
        amount: 0,
        transactions: [],
      };
    }
    const amount = Number(transaction.amount);
    acc[date].amount += isNaN(amount) ? 0 : amount;
    acc[date].transactions.push(transaction);
    return acc;
  }, {} as Record<string, any>);

  const chartData = Object.values(dailyTotals).sort(
    (a, b) => new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime()
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const date = new Date(data.rawDate);

      useEffect(() => {
        if (scrollRef.current) {
          // Clear any existing interval
          if (scrollIntervalRef.current) {
            clearInterval(scrollIntervalRef.current);
          }

          // Start new scrolling interval
          scrollIntervalRef.current = setInterval(() => {
            if (scrollRef.current) {
              scrollRef.current.scrollTop += 1;
            }
          }, 50);
        }

        return () => {
          if (scrollIntervalRef.current) {
            clearInterval(scrollIntervalRef.current);
          }
        };
      }, [data]);

      return (
        <div
          className="p-4 rounded-lg shadow-lg border border-gray-200 transaction-tooltip"
          style={{ width: "400px" }}>
          <p className="font-bold mb-2">
            {date.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p
            className={`font-bold mb-3 ${
              data.amount > 0 ? "text-red-600" : "text-green-600"
            }`}>
            Daily Total: {formatCurrency(Math.abs(data.amount))}
          </p>
          <div ref={scrollRef} className="max-h-64 overflow-y-auto">
            {data.transactions.map((t: Transaction, i: number) => (
              <div
                key={i}
                className="border-t border-gray-100 py-2 first:border-t-0">
                <div
                  className={`text-sm font-medium ${
                    Number(t.amount) > 0 ? "text-red-600" : "text-green-600"
                  }`}>
                  {formatCurrency(Math.abs(Number(t.amount) || 0))}
                </div>
                <div className="text-sm text-gray-600">
                  {t.description || "No description"}
                </div>
                {t.category && (
                  <div className="text-xs text-gray-500">
                    Category: {t.category}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return <ChartSkeleton />;
  }

  return (
    <div className="w-full h-[400px]">
      <div className="mb-8">
        <h2 className="text-2xl font-medium text-gray-900">
          Transactions Over Time
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          View your spending patterns and transactions across different dates
        </p>
      </div>
      <ResponsiveContainer width="95%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 10,
            left: 40,
            bottom: 5,
          }}>
          <XAxis
            dataKey="rawDate"
            interval={Math.floor(chartData.length / 5)}
            tickFormatter={(str) => {
              const date = new Date(str);
              return date.toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              });
            }}
            axisLine={false}
            tickLine={false}
            style={{
              fontSize: "12px",
              opacity: 0.6,
            }}
            padding={{ left: 30 }}
          />
          <YAxis
            tickFormatter={(value) => formatCurrency(Math.abs(value))}
            width={80}
            axisLine={false}
            tickLine={false}
            style={{
              fontSize: "12px",
              opacity: 0.6,
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="black"
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 6, fill: "black" }}
          />
          <Brush
            dataKey="rawDate"
            height={30}
            stroke="gray"
            tickFormatter={(str) => {
              const date = new Date(str);
              return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
            }}
            startIndex={0} // Start showing last 30 days by default
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
