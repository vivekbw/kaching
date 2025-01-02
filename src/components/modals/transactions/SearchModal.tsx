import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useState, useMemo, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";
import "./SearchModal.css";

interface SearchModalProps {
  transactions: any[];
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({
  transactions,
  isOpen,
  onClose,
}: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<
    "description" | "date" | "category"
  >("description");
  const [sortOrder, setSortOrder] = useState<
    "date" | "amount-asc" | "amount-desc"
  >("date");

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setSearchType("description");
      setSortOrder("date");
    }
  }, [isOpen]);

  const handleSearchTypeChange = (
    type: "description" | "date" | "category"
  ) => {
    setSearchTerm("");
    setSearchType(type);
  };

  const uniqueCategories = useMemo(() => {
    const categories = new Set(
      transactions.map((t) => t.category || "Uncategorized")
    );
    return Array.from(categories).sort();
  }, [transactions]);

  const filteredTransactions = transactions.filter((t) => {
    if (searchTerm === "") return true;

    switch (searchType) {
      case "description":
        return t.description?.toLowerCase().includes(searchTerm.toLowerCase());
      case "date":
        const searchDate = new Date(searchTerm).toLocaleDateString();
        const transactionDate = new Date(t.date).toLocaleDateString();
        return transactionDate === searchDate;
      case "category":
        return t.category === searchTerm;
      default:
        return false;
    }
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
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
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg shadow-lg w-[90vw] max-w-[500px] max-h-[85vh] flex flex-col">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-xl font-bold">
                Search Transactions
              </Dialog.Title>
              <Dialog.Close className="rounded-full p-1.5 hover:bg-gray-100">
                <Cross2Icon />
              </Dialog.Close>
            </div>

            <div className="flex gap-4 mb-4 flex-wrap">
              <button
                onClick={() => handleSearchTypeChange("description")}
                className={`px-3 py-1 rounded ${
                  searchType === "description"
                    ? "bg-black text-white"
                    : "bg-gray-100"
                }`}>
                Description
              </button>
              <button
                onClick={() => handleSearchTypeChange("date")}
                className={`px-3 py-1 rounded ${
                  searchType === "date" ? "bg-black text-white" : "bg-gray-100"
                }`}>
                Date
              </button>
              <button
                onClick={() => handleSearchTypeChange("category")}
                className={`px-3 py-1 rounded ${
                  searchType === "category"
                    ? "bg-black text-white"
                    : "bg-gray-100"
                }`}>
                Category
              </button>
            </div>

            {searchType === "category" ? (
              <select
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border rounded mb-4">
                <option value="">All Categories</option>
                {uniqueCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={searchType === "date" ? "date" : "text"}
                placeholder={
                  searchType === "description"
                    ? "Search by description..."
                    : "Select date..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full px-3 py-2 border rounded mb-4 ${
                  searchType === "date" ? "date-input" : ""
                }`}
              />
            )}

            <div className="flex justify-between items-center px-1">
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
          </div>

          <div className="overflow-y-auto p-6 space-y-3">
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
                  <div
                    className={`text-sm font-medium ${
                      Number(t.amount) > 0 ? "text-red-600" : "text-green-600"
                    }`}>
                    {formatCurrency(Math.abs(Number(t.amount) || 0))}
                  </div>
                </div>
              </div>
            ))}
            {sortedTransactions.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No transactions found
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
