import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";
import { Cross2Icon, ChevronDownIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { useState } from "react";
import { Transaction } from "@kaching/sdk";
import { formatCurrency } from "@/lib/utils";

interface CreateBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMonth: string;
  currentBudget: string;
  onSave: () => void;
  onMonthChange: (month: string) => void;
  onBudgetChange: (budget: string) => void;
  transactions: Transaction[];
}

export function CreateBudgetModal({
  isOpen,
  onClose,
  selectedMonth,
  currentBudget,
  onSave,
  onMonthChange,
  onBudgetChange,
  transactions,
}: CreateBudgetModalProps) {
  const [selectedYear, setSelectedYear] = useState(() => {
    const today = new Date();
    return today.getFullYear();
  });

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from({ length: 5 }, (_, i) => selectedYear - 2 + i);

  const handleMonthSelect = (month: string) => {
    const monthIndex = months.indexOf(month);
    const date = new Date(selectedYear, monthIndex);
    const monthYear = `${months[date.getMonth()]}-${date.getFullYear()}`;
    onMonthChange(monthYear);
  };

  const formatMonthDisplay = (monthYear: string) => {
    if (!monthYear) return "";
    const [month, year] = monthYear.split("-");
    return `${month} ${year}`;
  };

  const calculateMonthlyExpenses = () => {
    return transactions
      .filter((t) => {
        const transactionDate = new Date(t.date);
        const transactionMonth = `${
          months[transactionDate.getMonth()]
        }-${transactionDate.getFullYear()}`;
        return transactionMonth === selectedMonth && Number(t.amount) > 0;
      })
      .reduce((sum, t) => sum + Number(t.amount), 0);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg shadow-lg p-6 w-[90vw] max-w-[500px]">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-xl font-bold">
              Create New Budget
            </Dialog.Title>
            <Dialog.Close className="rounded-full p-1.5 hover:bg-gray-100">
              <Cross2Icon />
            </Dialog.Close>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Let's get your monthly budget set up! 🎯
                </h3>
                <p className="text-sm text-gray-500">
                  Setting a budget is the first step towards better financial
                  control
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Month and Year
                  </label>
                  <div className="flex gap-2">
                    <Select.Root
                      value={selectedYear.toString()}
                      onValueChange={(value) => setSelectedYear(Number(value))}>
                      <Select.Trigger className="inline-flex items-center justify-between w-32 px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-black">
                        <Select.Value />
                        <Select.Icon>
                          <ChevronDownIcon />
                        </Select.Icon>
                      </Select.Trigger>

                      <Select.Portal>
                        <Select.Content className="bg-white rounded-lg shadow-lg border">
                          <Select.Viewport>
                            {years.map((year) => (
                              <Select.Item
                                key={year}
                                value={year.toString()}
                                className="px-4 py-2 outline-none hover:bg-gray-100 cursor-pointer">
                                <Select.ItemText>{year}</Select.ItemText>
                              </Select.Item>
                            ))}
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {months.map((month) => (
                      <button
                        key={month}
                        onClick={() => handleMonthSelect(month)}
                        className={`p-2 text-sm rounded-lg transition-colors ${
                          selectedMonth === `${month}-${selectedYear}`
                            ? "bg-black text-white"
                            : "hover:bg-gray-100"
                        }`}>
                        {month}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 my-4 pt-4">
                  <div className="text-sm text-gray-600 mb-3">
                    Transaction Summary for {formatMonthDisplay(selectedMonth)}
                  </div>
                  {selectedMonth && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      {calculateMonthlyExpenses() > 0 ? (
                        <>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">Total Spent:</span>
                            <span className="font-medium text-red-600">
                              {formatCurrency(calculateMonthlyExpenses())}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Consider setting a budget higher than your current
                            spending
                          </div>
                        </>
                      ) : (
                        <div className="text-gray-500 text-sm">
                          No transactions found for this month
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget Amount
                  </label>
                  <input
                    type="number"
                    value={currentBudget}
                    onChange={(e) => onBudgetChange(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Enter budget amount..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                  Cancel
                </button>
                <button
                  onClick={onSave}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
                  Save Budget
                </button>
              </div>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
