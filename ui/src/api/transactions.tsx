import { api } from "@/lib/api";
import { transactionsSchemas } from "@desafio-dev/shared/transactions-schemas";
import z from "zod";

export type Transactions = z.infer<
  typeof transactionsSchemas.transactionResponse
>;

const getTransactions = {
  queryKey: ["transactions"],
  queryFn: async () => {
    const res = await api.get("/transactions");
    return res.data as z.infer<
      typeof transactionsSchemas.transactionResponse
    >[];
  },
};

const newTransactions = {
  mutationKey: ["create", "transactions"],
  mutationFn: async (
    data: z.infer<typeof transactionsSchemas.createTransaction>,
  ) => {
    const res = await api.post("/transactions", data);
    return res.data;
  },
};

const updateTransaction = {
  mutationKey: ["update", "transactions"],
  mutationFn: async (
    data: z.infer<typeof transactionsSchemas.updateTransactoin>,
  ) => {
    const res = await api.patch("/transactions/" + data.id, data);
    return res.data;
  },
};

const deleteTransaction = {
  mutationKey: ["delete", "transactions"],
  mutationFn: async (id: number) => {
    const res = await api.delete("/transactions/" + id);
    return res.data;
  },
};

export const transactions = {
  getTransactions,
  newTransactions,
  updateTransaction,
  deleteTransaction,
};
