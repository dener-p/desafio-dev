import { api } from "@/lib/api";
import { transactionsSchemas } from "@desafio-dev/shared/transactions-scehamas";
import { useMutation, useQuery } from "@tanstack/react-query";
import z from "zod";

const getTransactions = () =>
  useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const res = await api.get("/transactions");
      const json = res.data;
      if (res.status >= 400) {
        throw new Error({
          cause: json.cause,
          message: json.message,
        });
      }
      return json;
    },
  });

const newTransactions = () =>
  useMutation({
    mutationKey: ["create", "transactions"],
    mutationFn: async (
      data: z.infer<typeof transactionsSchemas.createTransaction>,
    ) => {
      const res = await api.post("/transactions", data);
      const json = res.data;
      if (res.status >= 400) {
        throw new Error({
          cause: json.cause,
          message: json.message,
        });
      }
      return json;
    },
  });

export const transactions = {
  getTransactions,
  newTransactions,
};
