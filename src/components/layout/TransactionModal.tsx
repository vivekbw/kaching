import { formatCurrency } from "@/lib/utils";
import "./TransactionModal.css";
import { useState, useEffect } from "react";

interface Transaction {
  date: string;
  amount: number;
  description?: string;
  category?: string;
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  category: string;
}

export function TransactionModal({
  isOpen,
  onClose,
  transactions,
  category,
}: TransactionModalProps) {
  const [sortOrder, setSortOrder] = useState<
    "date" | "amount-asc" | "amount-desc"
  >("date");

  // Reset sort order when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSortOrder("date");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sortedTransactions = [...transactions].sort((a, b) => {
    switch (sortOrder) {
      case "date":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "amount-desc":
        return Math.abs(Number(b.amount)) - Math.abs(Number(a.amount));
      case "amount-asc":
        return Math.abs(Number(a.amount)) - Math.abs(Number(b.amount));
      default:
        return 0;
    }
  });

  const handleAmountClick = () => {
    setSortOrder((current) => {
      if (current === "date") return "amount-desc";
      if (current === "amount-desc") return "amount-asc";
      return "date";
    });
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-container transaction-tooltip">
        <div className="modal-header">
          <h2 className="text-xl font-bold">{category} Transactions</h2>
          <button onClick={onClose} className="modal-close">
            ×
          </button>
        </div>
        <div className="flex justify-between items-center mb-4 px-1">
          <span className="text-sm text-gray-500">
            Sorted by: {sortOrder === "date" ? "Date" : "Amount"}
          </span>
          <button
            onClick={handleAmountClick}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
            {sortOrder === "amount-desc" && "↓ "}
            {sortOrder === "amount-asc" && "↑ "}
            Sort by Amount
          </button>
        </div>
        <div className="modal-content">
          {sortedTransactions.map((t, i) => (
            <div
              key={i}
              className="border-t border-gray-100 py-3 first:border-t-0">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm text-gray-600">
                    {new Date(t.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {t.description || "No description"}
                  </div>
                </div>
                <div className="text-sm font-medium text-red-600">
                  {formatCurrency(Math.abs(Number(t.amount) || 0))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
