import { api } from "@/lib/api";
import { DefaultErrorType } from "@/types/default-error-type";
import { transactionsSchemas } from "@desafio-dev/shared/transactions-schemas";
import z from "zod";

const getTransactions = {
  queryKey: ["transactions"],
  queryFn: async () => {
    const res = await api.get("/transactions");
    if (res.status >= 400) {
      const json = res.data as DefaultErrorType;
      throw new Error(json?.message ?? "Erro interno", { cause: json?.cause });
    }
    return res.data as z.infer<typeof transactionsSchemas.transactionResponse>;
  },
};

const newTransactions = {
  mutationKey: ["create", "transactions"],
  mutationFn: async (
    data: z.infer<typeof transactionsSchemas.createTransaction>,
  ) => {
    const res = await api.post("/transactions", data);
    if (res.status >= 400) {
      const json = res.data as DefaultErrorType;
      throw new Error(json?.message ?? "Erro interno", { cause: json?.cause });
    }
  },
};

export const transactions = {
  getTransactions,
  newTransactions,
};
