import { api } from "@/lib/api";
import { transactionsSchemas } from "@desafio-dev/shared/transactions-schemas";
import z from "zod";

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

export const transactions = {
  getTransactions,
  newTransactions,
};
