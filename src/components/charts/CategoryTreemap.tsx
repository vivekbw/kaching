import { useState } from "react";
import { Treemap, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils";
import { ChartSkeleton } from "./ChartSkeleton";
import { TransactionModal } from "../modals/transactions/TransactionModal";

interface Transaction {
  date: string;
  amount: number;
  description?: string;
  category?: string;
}

interface CategoryTreemapProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

const COLORS = [
  "#1a1a1a",
  "#333333",
  "#4d4d4d",
  "#666666",
  "#808080",
  "#999999",
];

const CustomizedContent = (props: any) => {
  const { x, y, width, height, name, value, index, colors, onClick } = props;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <g
      onClick={() => onClick(name)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ cursor: "pointer" }}>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: isHovered ? "#3b82f6" : colors[index % colors.length],
          stroke: "#fff",
          strokeWidth: 2,
          strokeOpacity: 1,
          transition: "fill 0.2s ease",
        }}
      />
      {width > 50 && height > 30 && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor="middle"
            fill="#fff"
            fontSize={14}>
            {name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 20}
            textAnchor="middle"
            fill="#fff"
            fontSize={12}>
            {formatCurrency(value)}
          </text>
        </>
      )}
    </g>
  );
};

export function CategoryTreemap({
  transactions,
  isLoading = false,
}: CategoryTreemapProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleClose = () => {
    setSelectedCategory(null);
  };

  if (isLoading) {
    return <ChartSkeleton />;
  }

  // Calculate total spent per category (only positive amounts/expenses)
  const categoryTotals = transactions.reduce((acc, transaction) => {
    const amount = Number(transaction.amount);
    if (amount > 0) {
      const category = transaction.category || "Miscellaneous";
      acc[category] = (acc[category] || 0) + amount;
    }
    return acc;
  }, {} as Record<string, number>);

  // Convert to treemap data format
  const data = [
    {
      name: "Expenses",
      children: Object.entries(categoryTotals)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value),
    },
  ];

  return (
    <div className="w-full h-[400px] mb-24">
      <div className="mb-8">
        <h2 className="text-2xl font-medium text-gray-900">
          Spending Categories
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Analyze your expenses broken down by category (powered by Foundry AIP)
        </p>
      </div>
      <ResponsiveContainer width="95%" height="100%">
        <Treemap
          data={data}
          dataKey="value"
          stroke="#fff"
          content={<CustomizedContent colors={COLORS} onClick={handleClick} />}
          aspectRatio={4 / 3}
        />
      </ResponsiveContainer>
      {selectedCategory && (
        <TransactionModal
          isOpen={true}
          onClose={handleClose}
          category={selectedCategory}
          transactions={transactions.filter(
            (t) => t.category === selectedCategory && Number(t.amount) > 0
          )}
        />
      )}
    </div>
  );
}
