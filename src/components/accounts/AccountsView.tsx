import { useState } from "react";
import { formatCurrency } from "@/lib/utils";

interface AccountsViewProps {
  transactions: any[];
  isLoading?: boolean;
}

export function AccountsView({
  transactions,
  isLoading = false,
}: AccountsViewProps) {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full mb-24">
      <div className="mb-8">
        <h2 className="text-2xl font-medium text-gray-900">Accounts</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage and view all your connected accounts
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm ring-1 ring-black/5">
        <p className="text-gray-500 text-center py-8">
          No accounts connected yet. Coming soon!
        </p>
      </div>
    </div>
  );
}
