import z from "zod";

const createCategory = z.object({
  name: z
    .string({ message: "Nome está invalido" })
    .min(3, { message: "Minímo de 3 caracteres" })
    .max(60, { message: "Maximo de 60 caracteres" })
    .trim(),
});
const categoryResponse = z.object({
  id: z.number(),
  name: z.string(),
});

const updateCategory = createCategory.extend({
  id: z.number(),
});
export const categoriesSchemas = {
  createCategory,
  categoryResponse,
  updateCategory,
};
