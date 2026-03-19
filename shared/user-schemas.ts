import { z } from "zod";
const createUser = z.object({
  name: z
    .string({ message: "Nome está invalido" })
    .min(3, { message: "Minímo de 3 caracteres" })
    .max(60, { message: "Maximo de 60 caracteres" })
    .trim(),
  email: z
    .email({ message: "Email está invalido" })
    .min(3, { message: "Minímo de 3 caracteres" })
    .max(60, { message: "Maximo de 60 caracteres" })
    .trim(),

  password: z
    .string({ message: "Senha está invalida" })
    .min(8, { message: "Minímo de 9 caracteres" })
    .max(60, { message: "Maximo de 60 caracteres" })
    .trim(),
});
const me = createUser.omit({ password: true }).extend({
  id: z.number(),
});
const login = createUser.omit({ name: true });
const loginResponse = z.object({
  token: z.string(),
});

export const userSchemas = { createUser, login, me, loginResponse };
