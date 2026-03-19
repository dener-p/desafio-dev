import { z } from "zod";
const createTransaction = z.object({
  description: z
    .string({ message: "Descrição está invalida" })
    .min(3, { message: "Minímo de 3 caracteres" })
    .max(200, { message: "Máximo de 200 caracteres" })
    .trim(),
  amount: z
    .number({ message: "Valor está invalido" })
    .min(1, { message: "O valor minímo é 1 " })
    .max(Number.MAX_SAFE_INTEGER, {
      message: `O valor máximo de ${Number.MAX_SAFE_INTEGER} `,
    }),
  type: z.enum(["income", "expense"]),
  categoryId: z.number({ message: "Categoria inválida." }),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Data inválida",
    }),
});

const updateTransactoin = createTransaction.extend({
  id: z.number(),
});

const transactionResponse = createTransaction.extend({
  id: z.number(),
  categoryName: z.string().nullable(),
});

export const transactionsSchemas = {
  createTransaction,
  transactionResponse,
  updateTransactoin,
};
