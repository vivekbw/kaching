import { getClient } from "@/lib/client";
import { createTransaction as createTransactionAction } from "@kaching/sdk";

interface TransactionParams {
  transaction_number: number;
  amount: number;
  category: string;
  date: string;
  description: string;
}

export async function createTransaction({
  transaction_number,
  amount,
  category,
  date,
  description,
}: TransactionParams): Promise<void> {
  const client = getClient();

  const result = await client(createTransactionAction).applyAction(
    {
      transaction_number,
      amount,
      category,
      date,
      description,
    },
    {
      $returnEdits: true,
    }
  );

  if (result.type === "edits") {
    console.log("Created transaction:", result.editedObjectTypes[0]);
  }
}
