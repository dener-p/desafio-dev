import { z } from "zod";
const createTransaction = z.object({
  description: z
    .string({ message: "Descrição está invalida" })
    .min(3, { message: "Minímo de 3 caracteres" })
    .max(200, { message: "Máximo de 200 caracteres" })
    .trim(),
  amount: z
    .number({ message: "Valor está invalido" })
    .min(0.01, { message: "O valor minímo é 0.01 " })
    .max(Number.MAX_SAFE_INTEGER, {
      message: `O valor máximo de ${Number.MAX_SAFE_INTEGER} `,
    }),
  type: z.enum(["income", "expense"]),
  categoryId: z.number({ message: "Categoria inválida." }),
  date: z.string(),
});

const transactionResponse = createTransaction.extend({
  id: z.number(),
});

export const transactionsSchemas = { createTransaction, transactionResponse };
