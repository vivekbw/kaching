import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";

interface BudgetDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  monthYear: string;
  budgetAmount: number;
  totalSpent: number;
  remainingBudget: number;
  percentageUsed: number;
  categoryTotals: Record<string, number>;
  formatMonthDisplay: (monthYear: string) => string;
}

export function BudgetDetailsModal({
  isOpen,
  onClose,
  monthYear,
  budgetAmount,
  totalSpent,
  remainingBudget,
  percentageUsed,
  categoryTotals,
  formatMonthDisplay,
}: BudgetDetailsModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg shadow-lg p-6 w-[90vw] max-w-[800px] max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-xl font-bold">
              Budget Details for {formatMonthDisplay(monthYear)}
            </Dialog.Title>
            <Dialog.Close className="rounded-full p-1.5 hover:bg-gray-100">
              <Cross2Icon />
            </Dialog.Close>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-medium">Budget Progress</h3>
                  <p className="text-sm text-gray-500">
                    {formatCurrency(totalSpent)} of{" "}
                    {formatCurrency(budgetAmount)} used
                  </p>
                </div>
                <div
                  className={`text-lg font-bold ${
                    remainingBudget >= 0 ? "text-green-600" : "text-red-600"
                  }`}>
                  {remainingBudget >= 0 ? "Remaining: " : "Over budget: "}
                  {formatCurrency(Math.abs(remainingBudget))}
                </div>
              </div>

              <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
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
              <div className="mt-2 text-sm text-gray-500 text-right">
                {percentageUsed.toFixed(1)}% used
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h3 className="text-lg font-medium">Category Breakdown</h3>
              </div>
              <div className="p-6">
                {Object.entries(categoryTotals)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, amount]) => (
                    <div
                      key={category}
                      className="flex justify-between items-center py-3 border-b last:border-0">
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
