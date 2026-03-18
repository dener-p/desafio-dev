import z from "zod";

const createCategory = z.object({
  name: z
    .string({ message: "Nome está invalido" })
    .min(3, { message: "Minímo de 3 caracteres" })
    .max(60, { message: "Maximo de 60 caracteres" })
    .trim(),
});

export const categoriesSchemas = { createCategory };
