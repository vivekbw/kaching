import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/utils";

interface Transaction {
  amount: number;
  category?: string;
}

interface CategoryPieChartProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

export function CategoryPieChart({
  transactions,
  isLoading = false,
}: CategoryPieChartProps) {
  if (isLoading) return <div>Loading...</div>;

  // Calculate total spent per category (only positive amounts/expenses)
  const categoryTotals = transactions.reduce((acc, transaction) => {
    const amount = Number(transaction.amount);
    if (amount > 0) {
      // Only include expenses
      const category = transaction.category || "Miscellaneous";
      acc[category] = (acc[category] || 0) + amount;
    }
    return acc;
  }, {} as Record<string, number>);

  // Convert to array format for PieChart
  const data = Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value); // Sort by value descending

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 rounded-lg shadow-lg border border-gray-200">
          <p className="font-bold">{payload[0].name}</p>
          <p className="text-gray-600">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[400px] mt-8">
      <h2 className="text-xl font-bold mb-4 text-center">
        Expenses by Category
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            startAngle={180}
            endAngle={0}
            outerRadius={150}
            fill="#8884d8"
            label={({ name, value }) => `${name}: ${formatCurrency(value)}`}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
