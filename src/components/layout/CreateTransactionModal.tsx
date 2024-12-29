import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useState, useEffect } from "react";
import { getClient } from "@/lib/client";
import { createTransaction } from "@/lib/createTransaction";

interface CreateTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface TransactionFormData {
  transaction_number: number;
  amount: string;
  category: string;
  date: string;
  description: string;
}

export function CreateTransactionModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateTransactionModalProps) {
  const defaultFormData = {
    transaction_number: Math.floor(Math.random() * 1000000) + 1,
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  };

  const [formData, setFormData] =
    useState<TransactionFormData>(defaultFormData);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData(defaultFormData);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createTransaction({
        transaction_number: formData.transaction_number,
        amount: Number(formData.amount),
        category: formData.category || "Uncategorized",
        date: formData.date,
        description: formData.description || "",
      });

      onSuccess();
      onClose();
      setFormData({
        transaction_number: Math.floor(Math.random() * 1000000) + 1,
        amount: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
        description: "",
      });
    } catch (error) {
      console.error("Error creating transaction:", error);
      alert("Failed to create transaction. Please try again.");
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg shadow-lg p-6 w-[90vw] max-w-[500px]">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-bold">
              Create Transaction
            </Dialog.Title>
            <Dialog.Close className="rounded-full p-1.5 hover:bg-gray-100">
              <Cross2Icon />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (negative for expenses, positive for deposits)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, amount: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded"
                required
                placeholder="Enter amount..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border rounded"
                required
                placeholder="Enter description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded"
                placeholder="Enter category..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors">
              Create Transaction
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
